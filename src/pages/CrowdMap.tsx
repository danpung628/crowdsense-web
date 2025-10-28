import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { crowdApi } from '../api/services';
import type { CrowdData } from '../api/types';

function CrowdMap() {
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchCrowdData();
  }, []);

  const fetchCrowdData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('👥 인파 데이터 요청 중...');
      
      const data = await crowdApi.getAll();
      console.log('✅ 인파 데이터 수신:', data);
      
      setCrowdData(data);
      setLoading(false);
    } catch (err) {
      const error = err as Error;
      console.error('❌ 인파 데이터 로딩 실패:', error);
      setError(error.message || '데이터를 불러올 수 없습니다.');
      setLoading(false);
    }
  };

  const getCongestionLevel = (data: Record<string, unknown>) => {
    // 데이터 구조: data['SeoulRtd.citydata_ppltn'][0].AREA_CONGEST_LVL
    const cityDataArray = data?.['SeoulRtd.citydata_ppltn'] as Array<Record<string, string>> | undefined;
    const cityData = cityDataArray?.[0];
    return cityData?.AREA_CONGEST_LVL || 'unknown';
  };

  const getCongestionMessage = (data: Record<string, unknown>) => {
    const cityDataArray = data?.['SeoulRtd.citydata_ppltn'] as Array<Record<string, string>> | undefined;
    const cityData = cityDataArray?.[0];
    return cityData?.AREA_CONGEST_MSG || '정보 없음';
  };

  const getCongestionColor = (level: string) => {
    const colors: { [key: string]: string } = {
      '여유': 'bg-green-500',
      '보통': 'bg-yellow-500',
      '약간 붐빔': 'bg-orange-400',
      '붐빔': 'bg-orange-600',
      '매우 붐빔': 'bg-red-500',
    };
    return colors[level] || 'bg-gray-500';
  };

  const getCongestionBadgeColor = (level: string) => {
    const colors: { [key: string]: string } = {
      '여유': 'bg-green-100 text-green-800',
      '보통': 'bg-yellow-100 text-yellow-800',
      '약간 붐빔': 'bg-orange-100 text-orange-800',
      '붐빔': 'bg-orange-200 text-orange-900',
      '매우 붐빔': 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const filteredData = filter === 'all' 
    ? crowdData 
    : crowdData.filter(item => getCongestionLevel(item.data) === filter);

  const congestionCounts = {
    '여유': crowdData.filter(item => getCongestionLevel(item.data) === '여유').length,
    '보통': crowdData.filter(item => getCongestionLevel(item.data) === '보통').length,
    '약간 붐빔': crowdData.filter(item => getCongestionLevel(item.data) === '약간 붐빔').length,
    '붐빔': crowdData.filter(item => getCongestionLevel(item.data) === '붐빔').length,
    '매우 붐빔': crowdData.filter(item => getCongestionLevel(item.data) === '매우 붐빔').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">인파 데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">데이터를 불러올 수 없습니다</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCrowdData}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">👥 실시간 인파 밀집도</h1>
          <p className="text-gray-600 mt-2">서울시 주요 지역 실시간 인파 현황</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div 
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setFilter('all')}
          >
            <div className="text-sm text-gray-600">전체</div>
            <div className="text-2xl font-bold text-gray-800">{crowdData.length}</div>
          </div>
          <div 
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === '여유' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setFilter('여유')}
          >
            <div className="text-sm text-gray-600">여유</div>
            <div className="text-2xl font-bold text-green-600">{congestionCounts['여유']}</div>
          </div>
          <div 
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === '보통' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setFilter('보통')}
          >
            <div className="text-sm text-gray-600">보통</div>
            <div className="text-2xl font-bold text-yellow-600">{congestionCounts['보통']}</div>
          </div>
          <div 
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === '약간 붐빔' ? 'ring-2 ring-orange-500' : ''}`}
            onClick={() => setFilter('약간 붐빔')}
          >
            <div className="text-sm text-gray-600">약간 붐빔</div>
            <div className="text-2xl font-bold text-orange-600">{congestionCounts['약간 붐빔']}</div>
          </div>
          <div 
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${filter === '붐빔' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setFilter('붐빔')}
          >
            <div className="text-sm text-gray-600">붐빔</div>
            <div className="text-2xl font-bold text-red-600">{congestionCounts['붐빔'] + congestionCounts['매우 붐빔']}</div>
          </div>
        </div>

        {/* 지역 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => {
            const level = getCongestionLevel(item.data);
            const message = getCongestionMessage(item.data);
            
            return (
              <div key={item.areaCode} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.areaInfo.areaName}</h3>
                    {item.areaInfo.engName && (
                      <p className="text-xs text-gray-500">{item.areaInfo.engName}</p>
                    )}
                  </div>
                  <span className={`${getCongestionBadgeColor(level)} text-xs font-semibold px-3 py-1 rounded-full`}>
                    {level}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{message}</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${getCongestionColor(level)} h-2 rounded-full transition-all duration-300`}
                      style={{ 
                        width: level === '여유' ? '20%' : 
                               level === '보통' ? '40%' : 
                               level === '약간 붐빔' ? '60%' : 
                               level === '붐빔' ? '80%' : '100%' 
                      }}
                    ></div>
                  </div>
                  
                  {(() => {
                    const cityDataArray = item.data?.['SeoulRtd.citydata_ppltn'] as Array<Record<string, string>> | undefined;
                    const cityData = cityDataArray?.[0];
                    return cityData?.AREA_PPLTN_MIN && cityData?.AREA_PPLTN_MAX ? (
                      <div className="text-xs text-gray-500 pt-2">
                        예상 인구: {parseInt(cityData.AREA_PPLTN_MIN).toLocaleString()}~{parseInt(cityData.AREA_PPLTN_MAX).toLocaleString()}명
                      </div>
                    ) : null;
                  })()}
                  
                  <div className="text-xs text-gray-500">
                    업데이트: {new Date(item.fetchedAt).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="pt-3 border-t mt-3">
                    <Link
                      to={`/history/${item.areaCode}`}
                      className="block w-full bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition text-xs"
                    >
                      📊 히스토리
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">해당 혼잡도 레벨의 지역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrowdMap;
