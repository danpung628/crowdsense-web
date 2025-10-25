import { useEffect, useState } from 'react';
import { parkingApi } from '../api/services';
import type { ParkingLot } from '../api/types';

function Parking() {
  const [parkingData, setParkingData] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 가용률 계산
  const getAvailabilityRate = (parking: ParkingLot) => {
    if (parking.capacity === 0) return 0;
    return Math.round((parking.available / parking.capacity) * 100);
  };

  // 가용률에 따른 색상
  const getAvailabilityColor = (rate: number) => {
    if (rate >= 30) return 'bg-green-500';
    if (rate >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 가용률에 따른 상태 텍스트
  const getAvailabilityText = (rate: number) => {
    if (rate >= 30) return '여유';
    if (rate >= 10) return '보통';
    return '혼잡';
  };

  // 데이터 가져오기
  const fetchParkingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await parkingApi.getAll();
      
      if (result.success) {
        setParkingData(result.data);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching parking data:', err);
      setError('서버와 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingData();
    
    // 2분마다 자동 새로고침
    const interval = setInterval(fetchParkingData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  // 검색 필터링
const filteredData = parkingData.filter(parking => {
  const query = searchQuery.toLowerCase();
  const name = parking.parkingName?.toLowerCase() || '';
  const addr = parking.addr?.toLowerCase() || '';
  return name.includes(query) || addr.includes(query);
});

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
            onClick={fetchParkingData}
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">실시간 주차장 정보</h1>
            <p className="text-gray-600">
              서울시 공영 주차장의 실시간 가용 현황을 확인하세요
            </p>
          </div>
          <button
            onClick={fetchParkingData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>🔄</span>
            <span>새로고침</span>
          </button>
        </div>

        {/* 검색창 */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="주차장 이름 또는 주소로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              🅿️
            </div>
            <div>
              <p className="text-gray-600 text-sm">전체 주차장</p>
              <p className="text-2xl font-bold">{parkingData.length}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <p className="text-gray-600 text-sm">가용 공간</p>
              <p className="text-2xl font-bold">
                {parkingData.reduce((sum, p) => sum + p.available, 0)}대
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              🚗
            </div>
            <div>
              <p className="text-gray-600 text-sm">전체 수용</p>
              <p className="text-2xl font-bold">
                {parkingData.reduce((sum, p) => sum + p.capacity, 0)}대
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex gap-4 justify-center bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">여유 (30% 이상)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">보통 (10-30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">혼잡 (10% 미만)</span>
        </div>
      </div>

      {/* 데이터가 없을 때 */}
      {filteredData.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">
            {searchQuery 
              ? '검색 결과가 없습니다.' 
              : '현재 표시할 데이터가 없습니다.'}
          </p>
        </div>
      )}

      {/* 주차장 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((parking) => {
          const availabilityRate = getAvailabilityRate(parking);
          const color = getAvailabilityColor(availabilityRate);
          const statusText = getAvailabilityText(availabilityRate);
          
          return (
            <div
              key={parking.parkingCode}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold line-clamp-1">
                  {parking.parkingName}
                </h3>
                <div
                  className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
                >
                  🅿️
                </div>
              </div>

              {/* 가용 현황 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">가용 공간</span>
                  <span className={`font-bold ${
                    availabilityRate >= 30 ? 'text-green-600' :
                    availabilityRate >= 10 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {parking.available} / {parking.capacity}대
                  </span>
                </div>
                
                {/* 프로그레스 바 */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${color} h-3 rounded-full transition-all`}
                    style={{ width: `${availabilityRate}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className={`${color} w-3 h-3 rounded-full`}></div>
                  <span className="text-sm font-semibold">{statusText}</span>
                  <span className="text-sm text-gray-500">({availabilityRate}%)</span>
                </div>
              </div>

              {/* 주소 */}
              <div className="text-sm text-gray-600 mb-2">
                <p className="line-clamp-2">{parking.addr}</p>
              </div>

              {/* 추가 정보 */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pt-4 border-t">
                <span>{parking.payYn === 'Y' ? '유료' : '무료'}</span>
                <span>코드: {parking.parkingCode}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Parking;
