import { useEffect, useState } from 'react';
import { parkingApi } from '../api/services';
import type { ParkingLot } from '../api/types';

function Parking() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchParkingData();
  }, []);

  const fetchParkingData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🅿️ 주차장 데이터 요청 중...');
      
      const data = await parkingApi.getAll();
      console.log('✅ 주차장 데이터 수신:', data);
      
      setParkingLots(data);
      setLoading(false);
    } catch (err) {
      const error = err as Error;
      console.error('❌ 주차장 데이터 로딩 실패:', error);
      setError(error.message || '데이터를 불러올 수 없습니다.');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchParkingData();
      return;
    }

    const filtered = parkingLots.filter(lot =>
      lot.district.includes(searchQuery) ||
      lot.address.includes(searchQuery)
    );
    
    setParkingLots(filtered);
  };

  const getAvailabilityColor = (available: number, total: number) => {
    if (total === 0) return 'text-gray-600 bg-gray-50';
    const ratio = available / total;
    if (ratio >= 0.5) return 'text-green-600 bg-green-50';
    if (ratio >= 0.2) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">주차장 데이터를 불러오는 중...</p>
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
              onClick={fetchParkingData}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validLots = parkingLots.filter(lot => lot.total > 0);
  const totalCapacity = validLots.reduce((sum, lot) => sum + lot.total, 0);
  const totalAvailable = validLots.reduce((sum, lot) => sum + lot.available, 0);
  const avgAvailability = validLots.length > 0
    ? Math.round((validLots.reduce((sum, lot) => sum + (lot.available / lot.total), 0) / validLots.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🅿️ 실시간 주차장 정보</h1>
          <p className="text-gray-600 mt-2">서울시 공영주차장 실시간 현황</p>
        </div>

        {/* 검색 바 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="주차장 주소 또는 구로 검색..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            >
              검색
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchParkingData();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
              >
                초기화
              </button>
            )}
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">총 주차장</div>
            <div className="text-2xl font-bold text-gray-800">{parkingLots.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">총 주차면</div>
            <div className="text-2xl font-bold text-gray-800">
              {totalCapacity.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">가용 주차면</div>
            <div className="text-2xl font-bold text-green-600">
              {totalAvailable.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">평균 가용률</div>
            <div className="text-2xl font-bold text-blue-600">
              {avgAvailability}%
            </div>
          </div>
        </div>

        {/* 주차장 목록 */}
        {parkingLots.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parkingLots.map((lot, index) => (
              <div key={lot.parkingId || `parking-${index}`} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-800 text-lg">{lot.district}</h3>
                  <p className="text-sm text-gray-600">{lot.address}</p>
                </div>

                <div className="space-y-2">
                  {lot.total > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">가용/전체</span>
                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${getAvailabilityColor(lot.available, lot.total)}`}>
                          {lot.available} / {lot.total}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            lot.available / lot.total >= 0.5 ? 'bg-green-500' :
                            lot.available / lot.total >= 0.2 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(lot.available / lot.total) * 100}%` }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">정보 없음</div>
                  )}

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-gray-600">요금:</span>
                    <span className={`font-semibold ${lot.fee.includes('무료') ? 'text-green-600' : 'text-orange-600'}`}>
                      {lot.fee}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 pt-1">
                    운영시간: {lot.operatingTime}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    업데이트: {new Date(lot.updatedAt).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Parking;
