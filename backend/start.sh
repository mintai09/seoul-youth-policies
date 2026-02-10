#!/bin/bash

# 백엔드 서버 시작 스크립트

echo "🚀 서울 청년 정책 추천 API 서버를 시작합니다..."

# 가상환경 활성화 (존재하는 경우)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# FastAPI 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
