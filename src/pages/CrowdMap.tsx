import { useEffect, useState } from 'react';
import { crowdApi } from '../api/services';
import type { CrowdData } from '../api/types';

function CrowdMap() {
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 혼잡도 레벨 계산 함수
  const getCongestionLevel = (data: any) => {
    // 서울시 API 응답에서 혼잡도 정보 추출
    // 실제 데이터 구조에 맞게 조정 필요
    const congestion = data?.AREA_CONGEST_LVL || '보통';
    
    if (congestion.includes('여유') || congestion === '녹색') {
      return { level: 'low', color: 'bg-green-500', text: '여유' };
    } else if (congestion.includes('보통') || congestion === '노란색') {
      return { level: 'medium', color: 'bg-yellow-500', text: '보통' };
    } else if (congestion.includes('붐빔') || congestion.includes('혼잡') || congestion === '빨간색') {
      return { level: 'high', color: 'bg-red-500', text: '붐빔' };
    }
    
    return { level: 'medium', color: 'bg-yellow-500', text: '보통' };
  };

  // 데이터 가져오기
  const fetchCrowdData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await crowdApi.getAll();
      
      if (result.success) {
        setCrowdData(result.data);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching crowd data:', err);
      setError('서버와 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrowdData();
    
    // 1분마다 자동 새로고침
    const interval = setInterval(fetchCrowdData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-bold mb-2">오류 발생</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCrowdData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">실시간 인파 모니터링</h1>
            <p className="text-gray-600">
              서울시 주요 지역의 실시간 인파 밀집도를 확인하세요
            </p>
          </div>
          <button
            onClick={fetchCrowdData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>🔄</span>
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex gap-4 justify-center bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">여유</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">보통</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">붐빔</span>
        </div>
      </div>

      {/* 데이터가 없을 때 */}
      {crowdData.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">현재 표시할 데이터가 없습니다.</p>
        </div>
      )}

      {/* 지역 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crowdData.map((area) => {
          const congestionInfo = getCongestionLevel(area.data);
          
          return (
            <div
              key={area.areaCode}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{area.areaInfo.areaName}</h3>
                <div
                  className={`${congestionInfo.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
                >
                  👥
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`${congestionInfo.color} w-3 h-3 rounded-full`}></div>
                <span className="text-lg font-semibold text-gray-700">
                  {congestionInfo.text}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>코드: {area.areaCode}</p>
                <p className="text-xs">
                  최근 업데이트: {new Date(area.fetchedAt).toLocaleTimeString('ko-KR')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CrowdMap;
