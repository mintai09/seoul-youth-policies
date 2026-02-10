@echo off
echo 🚀 서울 청년 정책 추천 API 서버를 시작합니다...

REM 가상환경 활성화 (존재하는 경우)
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM FastAPI 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
