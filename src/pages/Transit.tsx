function Transit() {
  // 서버의 /api/subway 응답 구조에 맞춘 목 데이터
  const mockSubwayData = [
    {
      stationId: "S001",
      stationName: "강남역",
      line: "2호선",
      congestion: "매우혼잡",
      level: 5,
      color: "bg-red-500",
    },
    {
      stationId: "S002",
      stationName: "홍대입구역",
      line: "2호선",
      congestion: "혼잡",
      level: 4,
      color: "bg-orange-500",
    },
    {
      stationId: "S003",
      stationName: "서울역",
      line: "1호선",
      congestion: "보통",
      level: 3,
      color: "bg-yellow-500",
    },
    {
      stationId: "S004",
      stationName: "잠실역",
      line: "2호선",
      congestion: "보통",
      level: 3,
      color: "bg-yellow-500",
    },
    {
      stationId: "S005",
      stationName: "여의도역",
      line: "5호선",
      congestion: "여유",
      level: 2,
      color: "bg-green-500",
    },
    {
      stationId: "S006",
      stationName: "용산역",
      line: "1호선",
      congestion: "원활",
      level: 1,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">실시간 지하철 혼잡도</h1>
        <p className="text-gray-600">
          서울시 주요 지하철역의 실시간 혼잡도를 확인하세요
        </p>
      </div>

      {/* 범례 */}
      <div className="flex gap-4 justify-center bg-white rounded-lg shadow-md p-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">원활</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">여유</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">보통</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm">혼잡</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">매우혼잡</span>
        </div>
      </div>

      {/* 지하철역 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSubwayData.map((station) => (
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
                className={`${station.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
              >
                🚇
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`${station.color} w-3 h-3 rounded-full`}></div>
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
                      i < station.level ? station.color : "bg-gray-200"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transit;
