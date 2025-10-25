import { useEffect, useState } from 'react';
import { subwayApi } from '../api/services';
import type { SubwayStation } from '../api/types';

function Transit() {
  const [subwayData, setSubwayData] = useState<SubwayStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<string>('전체');

  // 혼잡도에 따른 색상 반환
  const getCongestionColor = (level: number) => {
    if (level <= 2) return 'bg-green-500';
    if (level <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 데이터 가져오기
  const fetchSubwayData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await subwayApi.getAll();
      
      if (result.success) {
        setSubwayData(result.data);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching subway data:', err);
      setError('서버와 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubwayData();
    
    // 1분마다 자동 새로고침
    const interval = setInterval(fetchSubwayData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // 노선 필터링
  const filteredData = selectedLine === '전체' 
    ? subwayData 
    : subwayData.filter(station => station.line === selectedLine);

  // 고유 노선 목록 추출
  const uniqueLines = ['전체', ...new Set(subwayData.map(s => s.line))];

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
            onClick={fetchSubwayData}
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
            <h1 className="text-3xl font-bold mb-2">실시간 지하철 혼잡도</h1>
            <p className="text-gray-600">
              서울 지하철 주요 역의 실시간 혼잡도를 확인하세요
            </p>
          </div>
          <button
            onClick={fetchSubwayData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>🔄</span>
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* 노선 필터 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          {uniqueLines.map((line) => (
            <button
              key={line}
              onClick={() => setSelectedLine(line)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedLine === line
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {line}
            </button>
          ))}
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
          <span className="text-sm">혼잡</span>
        </div>
      </div>

      {/* 데이터가 없을 때 */}
      {filteredData.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">
            {selectedLine === '전체' 
              ? '현재 표시할 데이터가 없습니다.' 
              : `${selectedLine}에 대한 데이터가 없습니다.`}
          </p>
        </div>
      )}

      {/* 지하철역 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((station) => {
          const color = getCongestionColor(station.level);
          
          return (
            <div
              key={station.stationId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{station.stationName}</h3>
                  <p className="text-sm text-gray-500">{station.line}</p>
                </div>
                <div
                  className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
                >
                  🚇
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${color} w-3 h-3 rounded-full`}></div>
                <span className="text-lg font-semibold text-gray-700">
                  {station.congestion}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        i < station.level ? color : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                최근 업데이트: {new Date(station.updatedAt).toLocaleTimeString('ko-KR')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Transit;
