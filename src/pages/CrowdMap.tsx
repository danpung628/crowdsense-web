function CrowdMap() {
  // 나중에 실제 API 연동할 때 사용할 목 데이터
  // 서버의 /api/crowds 응답 구조에 맞춤
  const mockAreas = [
    {
      areaCode: "POI001",
      areaInfo: { areaName: "강남 MICE 관광특구" },
      level: "high",
      color: "bg-red-500",
      count: "매우 붐빔",
    },
    {
      areaCode: "POI002",
      areaInfo: { areaName: "홍대 관광특구" },
      level: "high",
      color: "bg-red-500",
      count: "매우 붐빔",
    },
    {
      areaCode: "POI003",
      areaInfo: { areaName: "명동 관광특구" },
      level: "medium",
      color: "bg-yellow-500",
      count: "보통",
    },
    {
      areaCode: "POI004",
      areaInfo: { areaName: "잠실 관광특구" },
      level: "medium",
      color: "bg-yellow-500",
      count: "보통",
    },
    {
      areaCode: "POI005",
      areaInfo: { areaName: "여의도" },
      level: "low",
      color: "bg-green-500",
      count: "여유",
    },
    {
      areaCode: "POI006",
      areaInfo: { areaName: "용산" },
      level: "low",
      color: "bg-green-500",
      count: "여유",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">실시간 인파 모니터링</h1>
        <p className="text-gray-600">
          서울시 주요 지역의 실시간 인파 밀집도를 확인하세요
        </p>
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

      {/* 지역 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAreas.map((area) => (
          <div
            key={area.areaCode}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{area.areaInfo.areaName}</h3>
              <div
                className={`${area.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
              >
                👥
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`${area.color} w-3 h-3 rounded-full`}></div>
              <span className="text-lg font-semibold text-gray-700">
                {area.count}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              코드: {area.areaCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrowdMap;
