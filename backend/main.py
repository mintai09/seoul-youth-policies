from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import yaml

app = FastAPI(title="Seoul Youth Policy Recommender")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 사용자 프로필 모델
class UserProfile(BaseModel):
    age: int
    isSeoulResident: bool
    isHouseOwner: bool
    householdType: str  # "single", "with_parents"
    employmentStatus: str  # "unemployed", "short_term", "full_time"
    monthlyIncome: int
    isStudent: bool
    isGraduate: bool
    rentDeposit: int = 0
    monthlyRent: int = 0
    transitUsageCount: int = 0
    hasReceivedSupport: List[str] = []
    caregiver: bool = False
    isFosterYouth: bool = False

# 정책 추천 로직
class PolicyRecommender:
    def __init__(self, rules_path: str = "../rules.yaml"):
        with open(rules_path, 'r', encoding='utf-8') as f:
            self.policies = yaml.safe_load(f)

    def calculate_total_rent(self, deposit: int, monthly_rent: int) -> float:
        """보증금 월세 환산액 계산"""
        return monthly_rent + (deposit * 0.05 / 12)

    def check_income_eligibility(self, user_income: int, threshold_percent: int, household_type: str = "single") -> bool:
        """소득 기준 확인 (2026년 기준)"""
        median_income_2026 = {
            "single": 2564238,
            "two": 4199292,
            "three": 5359036,
            "four": 6494738
        }

        base_income = median_income_2026.get("single", 2564238)
        threshold = base_income * (threshold_percent / 100)
        return user_income <= threshold

    def check_eligibility(self, policy: dict, user: UserProfile) -> tuple[bool, str]:
        """정책 자격 판정"""
        eligibility = policy.get('eligibility', {})
        tips = []

        # 연령 확인
        age_range = eligibility.get('age_range', [0, 999])
        if not (age_range[0] <= user.age <= age_range[1]):
            return False, ""

        # 서울 거주 확인
        if eligibility.get('seoul_resident') and not user.isSeoulResident:
            return False, ""

        # 주거 관련 정책
        if policy['id'] in ['YOUTH_RENT_SUBSIDY', 'MOVE_SUPPORT', 'DEPOSIT_INTEREST_SUBSIDY']:
            if user.isHouseOwner:
                return False, ""

            if eligibility.get('living_with_parents') == False and user.householdType != 'single':
                return False, ""

            # 보증금 확인
            if user.rentDeposit > eligibility.get('deposit_max', 999999999):
                return False, ""

            # 월세 확인
            if user.monthlyRent > eligibility.get('rent_max', 999999999):
                # 환산액 확인
                total_rent = self.calculate_total_rent(user.rentDeposit, user.monthlyRent)
                if total_rent > eligibility.get('total_rent_limit', 999999999):
                    return False, ""

            tips.append(f"보증금 {user.rentDeposit//10000}만원, 월세 {user.monthlyRent//10000}만원 조건 충족")

        # 소득 확인
        if 'income_threshold_percent' in eligibility:
            if not self.check_income_eligibility(
                user.monthlyIncome,
                eligibility['income_threshold_percent'],
                user.householdType
            ):
                return False, ""
            tips.append(f"중위소득 {eligibility['income_threshold_percent']}% 이하 충족")

        # 취업 상태 확인
        if 'employment_status' in eligibility:
            allowed_status = eligibility['employment_status']
            if isinstance(allowed_status, list):
                if user.employmentStatus not in allowed_status:
                    return False, ""
            elif user.employmentStatus != allowed_status:
                return False, ""

        # 학생 여부 확인
        if policy['id'] == 'YOUTH_ALLOWANCE' and user.isStudent:
            return False, ""

        # 교통 정책
        if policy['id'] == 'TRANSPORT_SUPPORT_SEOUL':
            if user.transitUsageCount < eligibility.get('transit_rides_monthly_min', 44):
                return False, ""
            tips.append(f"월 {user.transitUsageCount}회 이용 → 환급 가능")

        if policy['id'] == 'KPASS_YOUTH':
            if user.transitUsageCount < eligibility.get('transit_rides_monthly_min', 15):
                return False, ""

            # K-Pass vs 기후동행카드 비교
            estimated_monthly_cost = user.transitUsageCount * 1500
            if estimated_monthly_cost > 77500:
                tips.append("월 교통비가 77,500원 이상이므로 기후동행카드(월 55,000원)가 더 유리할 수 있습니다")
            else:
                tips.append(f"월 {user.transitUsageCount}회 이용 → 30% 환급 (최대 2만원)")

        # 저축 통장 정책
        if policy['id'] in ['HOPE_SAVING', 'FUTURE_SAVING']:
            if user.employmentStatus == 'unemployed':
                return False, ""

            if 'income_monthly_max' in eligibility and user.monthlyIncome > eligibility['income_monthly_max']:
                return False, ""

            if 'income_range' in eligibility:
                income_min, income_max = eligibility['income_range']
                if not (income_min <= user.monthlyIncome <= income_max):
                    return False, ""

        # 중복 지원 제한
        duplicate_blocked = eligibility.get('duplicate_programs_blocked', [])
        for blocked in duplicate_blocked:
            if blocked in user.hasReceivedSupport:
                return False, ""

        tip_text = " · ".join(tips) if tips else "조건 충족"
        return True, tip_text

    def recommend(self, user: UserProfile) -> dict:
        """정책 추천 실행"""
        recommendations = []

        for policy in self.policies:
            is_eligible, tip = self.check_eligibility(policy, user)

            if is_eligible:
                # 혜택 금액 계산
                benefit_amount = self.estimate_benefit(policy, user)

                recommendations.append({
                    "policy_id": policy['id'],
                    "policy_name": policy['name'],
                    "category": self.get_category(policy['id']),
                    "description": policy['description'],
                    "benefit": policy['benefit'],
                    "tip": tip,
                    "estimated_savings": benefit_amount
                })

        return {
            "eligible_count": len(recommendations),
            "recommendations": recommendations
        }

    def estimate_benefit(self, policy: dict, user: UserProfile) -> str:
        """예상 절감 금액 계산"""
        policy_id = policy['id']

        if policy_id == 'YOUTH_RENT_SUBSIDY':
            return "월 최대 20만원 (연 240만원)"
        elif policy_id == 'MOVE_SUPPORT':
            return "최대 40만원 (1회)"
        elif policy_id == 'DEPOSIT_INTEREST_SUBSIDY':
            return "연 2% 이자 지원"
        elif policy_id == 'YOUTH_ALLOWANCE':
            return "월 50만원 (최대 300만원)"
        elif policy_id == 'EMPLOYMENT_SUPPORT':
            return "월 50~60만원 (최대 6개월)"
        elif policy_id == 'TRANSPORT_SUPPORT_SEOUL':
            return "월 1만원 (연 12만원)"
        elif policy_id == 'KPASS_YOUTH':
            estimated = min(int(user.transitUsageCount * 1500 * 0.3), 20000)
            return f"월 약 {estimated//1000}만원 환급"
        elif policy_id == 'HOPE_SAVING':
            return "3년 후 최대 1,080만원"
        elif policy_id == 'FUTURE_SAVING':
            return "3년 후 720~1,440만원"
        else:
            return "혜택 있음"

    def get_category(self, policy_id: str) -> str:
        """정책 카테고리 분류"""
        if policy_id in ['YOUTH_RENT_SUBSIDY', 'YOUTH_RENT_ONETIME', 'MOVE_SUPPORT', 'DEPOSIT_INTEREST_SUBSIDY']:
            return "주거"
        elif policy_id in ['YOUTH_ALLOWANCE', 'EMPLOYMENT_SUPPORT']:
            return "소득"
        elif policy_id in ['HOPE_SAVING', 'FUTURE_SAVING']:
            return "자산형성"
        elif policy_id in ['TRANSPORT_SUPPORT_SEOUL', 'KPASS_YOUTH']:
            return "교통"
        else:
            return "기타"

# 추천 엔진 초기화
import os

# Docker 환경에서는 /app/rules.yaml, 로컬에서는 상대 경로
if os.path.exists("/app/rules.yaml"):
    rules_path = "/app/rules.yaml"
elif os.path.exists("rules.yaml"):
    rules_path = "rules.yaml"
else:
    rules_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "rules.yaml")

recommender = PolicyRecommender(rules_path=rules_path)

@app.get("/")
async def root():
    return {"message": "Seoul Youth Policy Recommender API", "version": "1.0"}

@app.post("/recommend")
async def recommend_policies(user: UserProfile):
    """정책 추천 API"""
    try:
        result = recommender.recommend(user)

        if result['eligible_count'] == 0:
            return {
                "eligible_count": 0,
                "recommendations": [],
                "message": "조건에 맞는 정책이 아직 없어요. 다음 기회에 더 많은 정책이 생길 거예요 :)"
            }

        return result
    except Exception as e:
        return {
            "error": str(e),
            "message": "추천 중 오류가 발생했습니다."
        }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
