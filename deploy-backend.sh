#!/bin/bash

echo "🚀 서울 청년 정책 추천 API 배포 시작..."

# Fly.io 로그인 확인
if ! flyctl auth whoami > /dev/null 2>&1; then
    echo "❌ Fly.io 로그인이 필요합니다."
    echo "   flyctl auth login 을 실행하세요."
    exit 1
fi

echo "✅ Fly.io 로그인 확인 완료"

# 배포
echo "📦 배포 중..."
flyctl deploy

if [ $? -eq 0 ]; then
    echo "✅ 배포 완료!"
    echo ""
    echo "🌐 배포된 서비스:"
    flyctl status
    echo ""
    echo "📝 API 문서: https://seoul-youth-policies-api.fly.dev/docs"
    echo "💚 헬스체크: https://seoul-youth-policies-api.fly.dev/health"
    echo ""
    echo "📊 로그 확인: flyctl logs"
else
    echo "❌ 배포 실패"
    exit 1
fi
