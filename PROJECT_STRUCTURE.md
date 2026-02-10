# 프로젝트 구조 상세 설명

## 디렉토리 구조

```
seoul-youth-policies/
│
├── backend/                          # FastAPI 백엔드
│   ├── main.py                       # 메인 서버 파일
│   ├── requirements.txt              # Python 패키지 목록
│   ├── start.sh                      # Linux/Mac 실행 스크립트
│   └── start.bat                     # Windows 실행 스크립트
│
├── frontend/                         # React 프론트엔드
│   ├── public/                       # 정적 파일
│   ├── src/
│   │   ├── pages/                    # 페이지 컴포넌트
│   │   │   ├── IntroPage.tsx         # 인트로 페이지
│   │   │   ├── SurveyPage.tsx        # 설문 페이지
│   │   │   └── ResultPage.tsx        # 결과 페이지
│   │   ├── components/               # 재사용 컴포넌트
│   │   │   └── WheelPicker.tsx       # 휠 선택기 UI
│   │   ├── store/                    # 상태 관리
│   │   │   └── useStore.ts           # Zustand 스토어
│   │   ├── App.tsx                   # 메인 앱 컴포넌트
│   │   ├── index.tsx                 # 앱 진입점
│   │   └── index.css                 # 글로벌 스타일
│   ├── package.json                  # npm 패키지 설정
│   ├── tailwind.config.js            # Tailwind 설정
│   ├── postcss.config.js             # PostCSS 설정
│   └── tsconfig.json                 # TypeScript 설정
│
├── rules.yaml                        # 정책 규칙 정의
├── README.md                         # 프로젝트 문서
├── QUICKSTART.md                     # 빠른 시작 가이드
├── PROJECT_STRUCTURE.md              # 이 파일
└── .gitignore                        # Git 제외 파일 목록
```

## 핵심 파일 설명

### backend/main.py

FastAPI 서버의 핵심 로직이 포함된 파일입니다.

**주요 클래스:**
- `UserProfile`: 사용자 설문 데이터 모델
- `PolicyRecommender`: 정책 추천 엔진
  - `check_eligibility()`: 정책별 자격 판정
  - `calculate_total_rent()`: 보증금 월세 환산액 계산
  - `check_income_eligibility()`: 소득 기준 확인
  - `recommend()`: 최종 추천 실행

**API 엔드포인트:**
- `GET /`: 헬스 체크
- `POST /recommend`: 정책 추천 (메인 API)
- `GET /health`: 서버 상태 확인

### rules.yaml

YAML 형식으로 정의된 정책 규칙 데이터베이스입니다.

**정책 필드:**
- `id`: 정책 고유 ID
- `name`: 정책명
- `description`: 설명
- `eligibility`: 자격 조건
  - `age_range`: 연령 범위
  - `seoul_resident`: 서울 거주 여부
  - `income_threshold_percent`: 소득 기준 (중위소득 %)
  - 기타 조건들...
- `benefit`: 혜택 내용

### frontend/src/pages/IntroPage.tsx

첫 화면 컴포넌트입니다.

**기능:**
- 서비스 소개
- 4개 카테고리 카드 표시 (주거/소득/자산형성/교통)
- 시작하기 버튼
- 소요 시간 및 개인정보 보호 안내

### frontend/src/pages/SurveyPage.tsx

설문 페이지 컴포넌트입니다.

**기능:**
- 10개 질문 단계별 표시
- 진행률 바 (상단)
- 두 가지 입력 방식:
  - `select`: 카드 선택형 (자동 다음)
  - `wheel`: 휠 선택형 (수동 다음)
- 이전/다음 버튼
- Zustand를 통한 실시간 상태 저장

**질문 목록:**
1. 나이
2. 서울 거주 여부
3. 주택 소유 여부
4. 가구 형태
5. 취업 상태
6. 월 소득
7. 학생 여부
8. 보증금
9. 월세
10. 대중교통 이용 횟수

### frontend/src/pages/ResultPage.tsx

추천 결과 페이지 컴포넌트입니다.

**기능:**
- API 호출 및 로딩 상태 표시
- 정책 카드 리스트
  - 카테고리 배지
  - 정책명 및 설명
  - 추천 이유 (파란색 박스)
  - 예상 혜택 금액
  - 신청하기 버튼
- 결과 없을 시 안내 메시지
- 처음으로 돌아가기 버튼

### frontend/src/components/WheelPicker.tsx

iOS 스타일 휠 선택기 컴포넌트입니다.

**특징:**
- 스크롤 기반 선택
- 중앙 정렬 및 스냅 효과
- 선택된 항목 강조 (크기 및 색상)
- 상하 페이드 효과

### frontend/src/store/useStore.ts

Zustand 상태 관리 스토어입니다.

**상태:**
- `userProfile`: 사용자 설문 응답
- `currentQuestion`: 현재 질문 인덱스

**액션:**
- `updateProfile()`: 프로필 업데이트
- `setCurrentQuestion()`: 질문 인덱스 변경
- `resetProfile()`: 초기화

## 데이터 흐름

```
사용자 입력 (SurveyPage)
    ↓
Zustand Store (useStore)
    ↓
API 호출 (ResultPage)
    ↓
FastAPI Backend (main.py)
    ↓
Policy Rules (rules.yaml)
    ↓
추천 알고리즘 (PolicyRecommender)
    ↓
JSON 응답
    ↓
결과 표시 (ResultPage)
```

## 스타일링 전략

### Tailwind CSS 유틸리티 클래스

**색상 팔레트:**
- Primary: `bg-blue-500`, `text-blue-600`
- Success: `bg-green-50`, `text-green-600`
- Warning: `bg-orange-50`, `text-orange-600`
- Purple: `bg-purple-50`, `text-purple-600`

**반응형 디자인:**
- 기본: 모바일 우선 (max-w-md)
- 태블릿: max-w-2xl
- 데스크톱: 중앙 정렬 유지

**애니메이션:**
- `transition-all duration-200`: 부드러운 전환
- `hover:` 상태: 버튼 및 카드 인터랙션

## 추천 로직 상세

### 주거 정책 판정

```python
# 보증금 월세 환산액 계산
total_rent = monthly_rent + (deposit * 0.05 / 12)

# 월세 지원 자격
if total_rent <= 930,000:
    eligible = True
```

### 소득 기준 판정

```python
# 2026년 중위소득 기준
median_income = {
    "single": 2,564,238,
    "two": 4,199,292,
    "three": 5,359,036,
    "four": 6,494,738
}

# 150% 기준 예시
threshold = median_income["single"] * 1.5  # 3,846,357원
```

### 교통 정책 최적화

```python
# 월 교통비 계산
monthly_cost = transit_count * 1500

# K-Pass vs 기후동행카드 비교
if monthly_cost > 77,500:
    recommend("기후동행카드")  # 55,000원 무제한
else:
    recommend("K-Pass")  # 30% 환급
```

## 확장 가능성

### 새 정책 추가
1. `rules.yaml`에 정책 정의 추가
2. 필요 시 `PolicyRecommender`에 특수 로직 추가
3. UI는 자동으로 반영됨

### 새 질문 추가
1. `SurveyPage.tsx`의 `questions` 배열에 추가
2. `useStore.ts`의 `UserProfile` 인터페이스 확장
3. 백엔드 `UserProfile` 모델 동기화

### 외부 API 연동
- `backend/main.py`에 외부 API 호출 함수 추가
- 실시간 소득 인증, 주민등록 확인 등

## 성능 최적화

- **백엔드**: FastAPI의 비동기 처리
- **프론트엔드**: React.memo, useMemo 활용 가능
- **번들 크기**: Tailwind CSS purge로 최소화
- **로딩 시간**: Code splitting 적용 가능

## 보안 고려사항

- 개인정보 비저장: 모든 데이터는 세션 기반
- CORS 설정: 허용된 도메인만 접근
- Input Validation: Pydantic을 통한 자동 검증
- XSS 방지: React의 기본 보호 기능 활용
