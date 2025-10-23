function Home() {
  const features = [
    {
      icon: "👥",
      title: "인파 모니터링",
      description: "실시간 도심 인파 밀집도 확인",
      color: "bg-blue-500",
    },
    {
      icon: "🚇",
      title: "교통 정보",
      description: "지하철 실시간 혼잡도 조회",
      color: "bg-green-500",
    },
    {
      icon: "🅿️",
      title: "주차 정보",
      description: "실시간 주차장 현황 제공",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">CrowdSense</h1>
        <p className="text-xl">도심 인파관리 스마트시티 시스템</p>
        <p className="mt-2 text-blue-100">실시간 데이터로 더 스마트한 이동을</p>
      </div>

      {/* 기능 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
          >
            <div
              className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
