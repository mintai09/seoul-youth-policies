import React from 'react';
import { useNavigate } from 'react-router-dom';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    { emoji: '🏠', label: '주거', color: 'bg-blue-50 text-blue-600' },
    { emoji: '💰', label: '소득', color: 'bg-green-50 text-green-600' },
    { emoji: '💎', label: '자산형성', color: 'bg-purple-50 text-purple-600' },
    { emoji: '🚇', label: '교통', color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            서울시 청년 정책 맞춤 추천
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            몇 가지 질문에 답하면
            <br />
            당신에게 꼭 맞는 정책을 찾아드려요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.color} rounded-xl p-4 text-center`}
            >
              <div className="text-3xl mb-2">{category.emoji}</div>
              <div className="text-sm font-medium">{category.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/survey')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-xl transition-colors duration-200 mb-4"
        >
          시작하기
        </button>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span>⏱️ 약 3분 소요</span>
            <span>·</span>
            <span>✨ 무료</span>
            <span>·</span>
            <span>🔒 개인정보 저장 안함</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
