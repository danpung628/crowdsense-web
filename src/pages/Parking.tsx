function Parking() {
  // 서버의 /api/parking 응답 구조에 맞춘 목 데이터
  const mockParkingData = [
    {
      parkingId: "P001",
      name: "강남역 공영주차장",
      available: 45,
      total: 100,
      fee: 3000,
      address: "서울시 강남구 역삼동",
      rate: 45,
    },
    {
      parkingId: "P002",
      name: "홍대 공영주차장",
      available: 12,
      total: 80,
      fee: 2500,
      address: "서울시 마포구 홍익동",
      rate: 15,
    },
    {
      parkingId: "P003",
      name: "명동 공영주차장",
      available: 5,
      total: 120,
      fee: 3500,
      address: "서울시 중구 명동",
      rate: 4,
    },
    {
      parkingId: "P004",
      name: "잠실 공영주차장",
      available: 78,
      total: 150,
      fee: 2000,
      address: "서울시 송파구 잠실동",
      rate: 52,
    },
    {
      parkingId: "P005",
      name: "여의도 공영주차장",
      available: 95,
      total: 200,
      fee: 2500,
      address: "서울시 영등포구 여의도동",
      rate: 48,
    },
    {
      parkingId: "P006",
      name: "용산 공영주차장",
      available: 62,
      total: 90,
      fee: 3000,
      address: "서울시 용산구 용산동",
      rate: 69,
    },
  ];

  const getAvailabilityColor = (rate: number) => {
    if (rate >= 50) return "bg-green-500";
    if (rate >= 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAvailabilityText = (rate: number) => {
    if (rate >= 50) return "여유";
    if (rate >= 20) return "보통";
    return "만차임박";
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">실시간 주차장 정보</h1>
        <p className="text-gray-600">
          서울시 주요 주차장의 실시간 가용 현황을 확인하세요
        </p>
      </div>

      {/* 범례 */}
      <div className="flex gap-4 justify-center bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">여유 (50% 이상)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">보통 (20-50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">만차임박 (20% 미만)</span>
        </div>
      </div>

      {/* 주차장 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockParkingData.map((parking) => (
          <div
            key={parking.parkingId}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{parking.name}</h3>
              <div
                className={`${getAvailabilityColor(
                  parking.rate
                )} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
              >
                🅿️
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">가용 주차면</span>
                <span className="text-xl font-bold text-blue-600">
                  {parking.available}/{parking.total}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`${getAvailabilityColor(
                    parking.rate
                  )} w-3 h-3 rounded-full`}
                ></div>
                <span className="font-semibold text-gray-700">
                  {getAvailabilityText(parking.rate)}
                </span>
              </div>

              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getAvailabilityColor(
                    parking.rate
                  )}`}
                  style={{ width: `${parking.rate}%` }}
                ></div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">주차요금</span>
                  <span className="font-semibold">
                    시간당 {parking.fee.toLocaleString()}원
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {parking.address}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Parking;
