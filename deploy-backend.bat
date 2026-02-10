@echo off
echo 🚀 서울 청년 정책 추천 API 배포 시작...

REM Fly.io 로그인 확인
flyctl auth whoami >nul 2>&1
if errorlevel 1 (
    echo ❌ Fly.io 로그인이 필요합니다.
    echo    flyctl auth login 을 실행하세요.
    exit /b 1
)

echo ✅ Fly.io 로그인 확인 완료

REM 배포
echo 📦 배포 중...
flyctl deploy

if errorlevel 0 (
    echo ✅ 배포 완료!
    echo.
    echo 🌐 배포된 서비스:
    flyctl status
    echo.
    echo 📝 API 문서: https://seoul-youth-policies-api.fly.dev/docs
    echo 💚 헬스체크: https://seoul-youth-policies-api.fly.dev/health
    echo.
    echo 📊 로그 확인: flyctl logs
) else (
    echo ❌ 배포 실패
    exit /b 1
)
