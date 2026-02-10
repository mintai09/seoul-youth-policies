# 프론트엔드 실행 가이드

## 방법 1: 기본 포트 (3000)에서 실행

```bash
cd seoul-youth-policies/frontend
npm start
```

브라우저가 자동으로 열리고 http://localhost:3000 에서 앱이 실행됩니다.

## 방법 2: 다른 포트 (3001)에서 실행

3000번 포트가 사용 중일 경우:

```bash
cd seoul-youth-policies/frontend
npm start
```

`.env` 파일에 이미 `PORT=3001`이 설정되어 있어 자동으로 3001번 포트에서 실행됩니다.

브라우저에서 http://localhost:3001 로 접속하세요.

## 방법 3: Windows에서 포트 지정

PowerShell:
```powershell
$env:PORT=3001; npm start
```

CMD:
```cmd
set PORT=3001 && npm start
```

## 포트 충돌 해결

3000번 포트를 사용 중인 프로세스를 종료하려면:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [프로세스ID] /F
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

## 문제 해결

### Tailwind CSS 오류가 발생하는 경우

```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

### 패키지 충돌이 발생하는 경우

```bash
rm -rf node_modules package-lock.json
npm install
```

### 빌드 캐시 초기화

```bash
npm start -- --reset-cache
```

## 개발 서버 URL

- 프론트엔드: http://localhost:3001
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs
