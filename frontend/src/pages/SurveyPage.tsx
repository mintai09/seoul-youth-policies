import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface Question {
  id: string;
  question: string;
  type: 'select';
  options: { value: any; label: string }[];
  key: keyof any;
}

const questions: Question[] = [
  {
    id: '1',
    question: '만 나이가 어떻게 되시나요?',
    type: 'select',
    options: [
      { value: 20, label: '19~22세 (대학 저학년)' },
      { value: 25, label: '23~26세 (대학 고학년/사회초년생)' },
      { value: 29, label: '27~30세 (사회생활 초중반)' },
      { value: 33, label: '31~34세 (사회생활 중후반)' },
      { value: 37, label: '35~39세' },
    ],
    key: 'age',
  },
  {
    id: '2',
    question: '서울시에 거주하고 계신가요?',
    type: 'select',
    options: [
      { value: true, label: '예, 서울 거주 중이에요' },
      { value: false, label: '아니요, 다른 지역이에요' },
    ],
    key: 'isSeoulResident',
  },
  {
    id: '3',
    question: '현재 집을 소유하고 계신가요?',
    type: 'select',
    options: [
      { value: false, label: '무주택자예요' },
      { value: true, label: '집을 소유하고 있어요' },
    ],
    key: 'isHouseOwner',
  },
  {
    id: '4',
    question: '현재 가구 형태는 어떻게 되나요?',
    type: 'select',
    options: [
      { value: 'single', label: '독립 거주 (1인 가구)' },
      { value: 'with_parents', label: '부모님과 함께 거주' },
    ],
    key: 'householdType',
  },
  {
    id: '5',
    question: '현재 취업 상태는 어떻게 되나요?',
    type: 'select',
    options: [
      { value: 'unemployed', label: '미취업 상태예요' },
      { value: 'short_term', label: '단기/아르바이트 근로 중' },
      { value: 'full_time', label: '정규직으로 근무 중' },
    ],
    key: 'employmentStatus',
  },
  {
    id: '6',
    question: '월 소득은 어느 정도인가요?',
    type: 'select',
    options: [
      { value: 500000, label: '💵 50만원 이하' },
      { value: 1500000, label: '💵 100~200만원' },
      { value: 2500000, label: '💵 200~300만원' },
      { value: 3500000, label: '💵 300~400만원' },
      { value: 4000000, label: '💵 400만원 이상' },
    ],
    key: 'monthlyIncome',
  },
  {
    id: '7',
    question: '현재 학생이신가요?',
    type: 'select',
    options: [
      { value: false, label: '아니요' },
      { value: true, label: '대학(원) 재학/휴학 중' },
    ],
    key: 'isStudent',
  },
  {
    id: '8',
    question: '보증금은 얼마인가요?',
    type: 'select',
    options: [
      { value: 0, label: '💰 없음 (월세만 또는 자가)' },
      { value: 10000000, label: '💰 1,000만원 이하' },
      { value: 30000000, label: '💰 3,000만원 정도' },
      { value: 50000000, label: '💰 5,000만원 정도' },
      { value: 80000000, label: '💰 8,000만원 이상' },
    ],
    key: 'rentDeposit',
  },
  {
    id: '9',
    question: '월세는 얼마인가요?',
    type: 'select',
    options: [
      { value: 0, label: '🏠 없음 (전세 또는 자가)' },
      { value: 300000, label: '🏠 30만원 이하' },
      { value: 500000, label: '🏠 40~60만원' },
      { value: 700000, label: '🏠 60~80만원' },
      { value: 800000, label: '🏠 80만원 이상' },
    ],
    key: 'monthlyRent',
  },
  {
    id: '10',
    question: '한 달에 대중교통을 몇 번 이용하시나요?',
    type: 'select',
    options: [
      { value: 0, label: '🚇 거의 안 씀 (월 0~5회)' },
      { value: 15, label: '🚇 가끔씩 (월 10~20회)' },
      { value: 30, label: '🚇 자주 이용 (월 30회 정도)' },
      { value: 44, label: '🚇 거의 매일 (월 44회 이상)' },
      { value: 60, label: '🚇 출퇴근 필수 (월 60회 이상)' },
    ],
    key: 'transitUsageCount',
  },
];

const SurveyPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { userProfile, updateProfile } = useStore();
  const navigate = useNavigate();

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 설문 완료
      navigate('/result');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigate('/');
    }
  };

  const handleSelectOption = (value: any) => {
    updateProfile({ [currentQuestion.key]: value });
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-blue-500 h-1 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white shadow-sm">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900 p-2"
        >
          ← 이전
        </button>
        <span className="text-sm text-gray-600">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(option.value)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-white transition-all duration-200 text-left"
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
