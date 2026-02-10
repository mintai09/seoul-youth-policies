# 서울 청년 정책 맞춤 추천 서비스

서울에 거주하는 만 19~34세 청년을 위한 맞춤형 정책 추천 웹앱입니다.
간단한 설문 응답만으로 주거, 소득, 교통, 자산형성 분야의 청년 지원 정책을 자동으로 추천받을 수 있습니다.

## 주요 기능

- 🏠 **주거 지원**: 월세 지원, 이사비 지원, 보증금 이자 지원
- 💰 **소득 지원**: 청년수당, 취업지원제도
- 💎 **자산형성 지원**: 희망두배 청년통장, 청년내일저축계좌
- 🚇 **교통비 지원**: K-Pass, 기후동행카드 추천

## 기술 스택

### 프론트엔드
- **React 18** (TypeScript)
- **Tailwind CSS** - 깔끔한 UI 디자인
- **Zustand** - 가볍고 효율적인 상태 관리
- **React Router** - 페이지 라우팅
- **Axios** - API 통신

### 백엔드
- **FastAPI** - 빠르고 현대적인 Python 웹 프레임워크
- **Pydantic** - 데이터 검증
- **PyYAML** - 정책 규칙 관리

## 프로젝트 구조

```
seoul-youth-policies/
├── backend/
│   ├── main.py              # FastAPI 서버 및 추천 로직
│   └── requirements.txt     # Python 패키지 의존성
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── IntroPage.tsx      # 인트로 페이지
│   │   │   ├── SurveyPage.tsx     # 설문 페이지
│   │   │   └── ResultPage.tsx     # 결과 페이지
│   │   ├── components/
│   │   │   └── WheelPicker.tsx    # 휠 선택 UI 컴포넌트
│   │   ├── store/
│   │   │   └── useStore.ts        # Zustand 상태 관리
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tailwind.config.js
└── rules.yaml               # 정책 규칙 정의
```

## 설치 및 실행

### 1. 백엔드 실행

```bash
# 백엔드 디렉토리로 이동
cd seoul-youth-policies/backend

# Python 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# FastAPI 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

서버가 실행되면 `http://localhost:8000`에서 API에 접근할 수 있습니다.
- API 문서: `http://localhost:8000/docs`
- 대체 문서: `http://localhost:8000/redoc`

### 2. 프론트엔드 실행

```bash
# 프론트엔드 디렉토리로 이동
cd seoul-youth-policies/frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm start
```

브라우저가 자동으로 열리며 `http://localhost:3000`에서 앱을 확인할 수 있습니다.

## API 사용법

### POST /recommend

사용자 프로필을 기반으로 정책을 추천합니다.

**요청 예시:**

```json
{
  "age": 25,
  "isSeoulResident": true,
  "isHouseOwner": false,
  "householdType": "single",
  "employmentStatus": "full_time",
  "monthlyIncome": 2500000,
  "isStudent": false,
  "isGraduate": true,
  "rentDeposit": 30000000,
  "monthlyRent": 500000,
  "transitUsageCount": 44,
  "hasReceivedSupport": [],
  "caregiver": false,
  "isFosterYouth": false
}
```

**응답 예시:**

```json
{
  "eligible_count": 3,
  "recommendations": [
    {
      "policy_id": "YOUTH_RENT_SUBSIDY",
      "policy_name": "서울 청년 월세 지원",
      "category": "주거",
      "description": "무주택 청년 1인가구 대상 최대 20만원 월세 12개월 지원",
      "benefit": "월 최대 20만원, 최대 12개월 지원",
      "tip": "보증금 3000만원, 월세 50만원 조건 충족 · 중위소득 150% 이하 충족",
      "estimated_savings": "월 최대 20만원 (연 240만원)"
    }
  ]
}
```

## 정책 추가/수정 방법

`rules.yaml` 파일을 수정하여 새로운 정책을 추가하거나 기존 정책을 업데이트할 수 있습니다.

```yaml
- id: NEW_POLICY
  name: 새로운 정책
  description: 정책 설명
  eligibility:
    age_range: [19, 34]
    seoul_resident: true
    # 추가 조건들...
  benefit: "혜택 내용"
```

## 설문 문항

1. 만 나이 (19~39세)
2. 서울 거주 여부
3. 주택 소유 여부
4. 가구 형태 (독립/부모님과 거주)
5. 취업 상태 (미취업/단기근로/정규직)
6. 월 소득
7. 학생 여부
8. 보증금
9. 월세
10. 월 대중교통 이용 횟수

## 디자인 특징

- **토스 앱 스타일**: 군더더기 없는 깔끔한 UI
- **모바일 퍼스트**: 모바일 환경에 최적화된 반응형 디자인
- **직관적 UX**: 휠 선택기와 카드 선택 방식의 편리한 입력
- **진행률 표시**: 설문 진행 상황을 실시간으로 확인

## 주요 추천 로직

### 주거 정책
- 보증금 + 월세 환산액 계산 (환산율 5.0%)
- 소득 기준: 2026년 중위소득 기준 적용
- 1인 가구 중위소득: 2,564,238원

### 교통 정책
- **K-Pass**: 월 15회 이상 이용 시 30% 환급
- **기후동행카드**: 월 77,500원 이상 사용 시 더 유리
- 자동 비교 및 최적 선택 추천

### 자산형성 정책
- 소득 구간별 맞춤 통장 추천
- 중복 가입 제한 처리

## 참고 자료

- 서울시 청년몽땅정보통: https://youth.seoul.go.kr
- 서울주거포털: https://housing.seoul.go.kr
- 복지로: https://www.bokjiro.go.kr

## 라이선스

이 프로젝트는 교육 및 비영리 목적으로 제작되었습니다.

## 개발자

2026 청년AI 프로젝트
