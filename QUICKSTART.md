# 빠른 시작 가이드

## 1. 백엔드 실행 (터미널 1)

```bash
cd seoul-youth-policies/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

또는 Windows에서:
```bash
cd seoul-youth-policies\backend
pip install -r requirements.txt
start.bat
```

✅ 백엔드가 실행되면: http://localhost:8000/docs 에서 API 문서를 확인할 수 있습니다.

## 2. 프론트엔드 실행 (터미널 2)

```bash
cd seoul-youth-policies/frontend
npm install
npm start
```

✅ 프론트엔드가 실행되면: http://localhost:3000 에서 웹앱이 자동으로 열립니다.

## 테스트 시나리오

### 시나리오 1: 월세 지원 대상 청년
- 나이: 25세
- 서울 거주: 예
- 무주택: 예
- 독립 거주
- 정규직
- 월소득: 250만원
- 보증금: 3,000만원
- 월세: 50만원
- 대중교통: 월 44회

**예상 결과**: 청년 월세 지원, K-Pass 등 추천

### 시나리오 2: 미취업 청년
- 나이: 27세
- 서울 거주: 예
- 무주택: 예
- 독립 거주
- 미취업
- 월소득: 50만원 이하
- 학생: 아니요
- 대중교통: 월 10회

**예상 결과**: 서울 청년수당, 국민취업지원제도 등 추천

### 시나리오 3: 저축 통장 대상자
- 나이: 29세
- 서울 거주: 예
- 정규직 근로
- 월소득: 200만원
- 부모님 소득/자산 기준 충족

**예상 결과**: 희망두배 청년통장, 청년내일저축계좌 추천

## 문제 해결

### 백엔드가 실행되지 않을 때
- Python 3.8 이상이 설치되어 있는지 확인
- `pip install --upgrade pip` 실행
- rules.yaml 파일이 backend 상위 폴더에 있는지 확인

### 프론트엔드가 실행되지 않을 때
- Node.js 16 이상이 설치되어 있는지 확인
- `npm cache clean --force` 실행 후 재시도
- `rm -rf node_modules && npm install` 로 재설치

### API 연결 오류
- 백엔드가 8000번 포트에서 실행 중인지 확인
- CORS 오류 시: 백엔드 main.py의 CORS 설정 확인
- 브라우저 콘솔에서 네트워크 탭 확인

## 개발 팁

### 정책 규칙 수정
`rules.yaml` 파일을 수정하면 백엔드가 자동으로 재시작됩니다 (--reload 옵션 사용 시).

### UI 스타일 수정
Tailwind CSS를 사용하므로 클래스명 수정만으로 스타일 변경이 가능합니다.

### 설문 문항 추가
`frontend/src/pages/SurveyPage.tsx`의 `questions` 배열에 새 문항을 추가하고,
`useStore.ts`의 `UserProfile` 인터페이스에 해당 필드를 추가하세요.

## 배포

### 프론트엔드 빌드
```bash
cd frontend
npm run build
```

빌드된 파일은 `frontend/build` 폴더에 생성됩니다.

### 백엔드 프로덕션 실행
```bash
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 다음 단계

1. 실제 서울시 API 연동
2. 사용자 통계 및 분석 대시보드
3. 정책 신청 바로가기 링크 추가
4. 카카오톡 공유 기능
5. PWA(Progressive Web App) 변환
