import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { config } from '../config';

interface PolicyRecommendation {
  policy_id: string;
  policy_name: string;
  category: string;
  description: string;
  benefit: string;
  tip: string;
  estimated_savings: string;
}

interface ApiResponse {
  eligible_count: number;
  recommendations: PolicyRecommendation[];
  message?: string;
}

const ResultPage: React.FC = () => {
  const { userProfile, resetProfile } = useStore();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.post<ApiResponse>(
          `${config.apiUrl}/recommend`,
          userProfile
        );
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setResult({
          eligible_count: 0,
          recommendations: [],
          message: '추천 결과를 불러오는 중 오류가 발생했습니다.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userProfile]);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      주거: '🏠',
      소득: '💰',
      자산형성: '💎',
      교통: '🚇',
      기타: '📋',
    };
    return icons[category] || '📋';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      주거: 'bg-blue-50 text-blue-600 border-blue-200',
      소득: 'bg-green-50 text-green-600 border-green-200',
      자산형성: 'bg-purple-50 text-purple-600 border-purple-200',
      교통: 'bg-orange-50 text-orange-600 border-orange-200',
      기타: 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return colors[category] || colors['기타'];
  };

  const handleRestart = () => {
    resetProfile();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">정책을 분석하고 있어요...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-6 mb-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            추천 결과
          </h1>
          {result && result.eligible_count > 0 ? (
            <p className="text-gray-600">
              총 <span className="text-blue-600 font-semibold">{result.eligible_count}개</span>의
              정책이 적합해요
            </p>
          ) : (
            <p className="text-gray-600">{result?.message}</p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4">
        {result && result.recommendations.length > 0 ? (
          <div className="space-y-4">
            {result.recommendations.map((policy, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        policy.category
                      )}`}
                    >
                      <span>{getCategoryIcon(policy.category)}</span>
                      {policy.category}
                    </span>
                  </div>

                  {/* Policy Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {policy.policy_name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3">
                    {policy.description}
                  </p>

                  {/* Tip */}
                  {policy.tip && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">추천 이유:</span> {policy.tip}
                      </p>
                    </div>
                  )}

                  {/* Benefit */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">예상 혜택</p>
                      <p className="text-lg font-bold text-blue-600">
                        {policy.estimated_savings}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">지원 내용</p>
                      <p className="text-sm text-gray-700">{policy.benefit}</p>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => {
                      alert(
                        '실제 신청은 서울시 청년몽땅정보통(youth.seoul.go.kr)에서 가능합니다.'
                      );
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors duration-200"
                  >
                    신청하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">😊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              조건에 맞는 정책이 아직 없어요
            </h3>
            <p className="text-gray-600 mb-6">
              다음 기회에 더 많은 정책이 생길 거예요
            </p>
          </div>
        )}

        {/* Restart Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
