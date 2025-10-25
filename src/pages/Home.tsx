import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { crowdApi, subwayApi, parkingApi, rankingApi } from '../api/services';
import type { RankingItem } from '../api/types';

function Home() {
  const [stats, setStats] = useState({
    crowdCount: 0,
    subwayCount: 0,
    parkingCount: 0,
    totalAvailableParking: 0,
  });
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 대시보드 데이터 가져오기
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 병렬로 모든 API 호출
      const [crowdResult, subwayResult, parkingResult, rankingResult] = await Promise.all([
        crowdApi.getAll().catch(() => ({ success: false, data: [] })),
        subwayApi.getAll().catch(() => ({ success: false, data: [] })),
        parkingApi.getAll().catch(() => ({ success: false, data: [] })),
        rankingApi.getTopPlaces(5).catch(() => ({ success: false, data: [] })),
      ]);

      // 통계 계산
      const newStats = {
        crowdCount: crowdResult.success ? crowdResult.data.length : 0,
        subwayCount: subwayResult.success ? subwayResult.data.length : 0,
        parkingCount: parkingResult.success ? parkingResult.data.length : 0,
        totalAvailableParking: parkingResult.success
          ? parkingResult.data.reduce((sum, p) => sum + p.available, 0)
          : 0,
      };

      setStats(newStats);
      
      if (rankingResult.success) {
        setTopPlaces(rankingResult.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // 2분마다 자동 새로고침
    const interval = setInterval(fetchDashboardData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "👥",
      title: "인파 모니터링",
      description: "실시간 도심 인파 밀집도 확인",
      color: "bg-blue-500",
      link: "/crowd",
      stat: `${stats.crowdCount}개 지역`,
    },
    {
      icon: "🚇",
      title: "교통 정보",
      description: "지하철 실시간 혼잡도 조회",
      color: "bg-green-500",
      link: "/transit",
      stat: `${stats.subwayCount}개 역`,
    },
    {
      icon: "🅿️",
      title: "주차 정보",
      description: "실시간 주차장 현황 제공",
      color: "bg-purple-500",
      link: "/parking",
      stat: `${stats.totalAvailableParking}대 가용`,
    },
  ];

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

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">CrowdSense</h1>
        <p className="text-xl">도심 인파관리 스마트시티 시스템</p>
        <p className="mt-2 text-blue-100">실시간 데이터로 더 스마트한 이동을</p>
        <button
          onClick={fetchDashboardData}
          className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          🔄 데이터 새로고침
        </button>
      </div>

      {/* 기능 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div
              className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-3">{feature.description}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm font-semibold text-gray-700">
                {feature.stat}
              </span>
              <span className="text-blue-600 font-semibold">보기 →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* 인기 장소 랭킹 */}
      {topPlaces.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🏆 실시간 인기 장소</h2>
          <div className="space-y-3">
            {topPlaces.map((place, index) => (
              <div
                key={place.areaCode}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0
                      ? 'bg-yellow-500'
                      : index === 1
                      ? 'bg-gray-400'
                      : index === 2
                      ? 'bg-orange-600'
                      : 'bg-blue-500'
                  }`}
                >
                  {place.rank}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{place.areaName}</h3>
                  <p className="text-sm text-gray-500">
                    평균 인구: {place.avgPopulation.toLocaleString()}명
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 시스템 정보 */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">📊 시스템 현황</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.crowdCount}</p>
            <p className="text-sm text-gray-600">모니터링 지역</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.subwayCount}</p>
            <p className="text-sm text-gray-600">지하철역</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.parkingCount}</p>
            <p className="text-sm text-gray-600">주차장</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {stats.totalAvailableParking}
            </p>
            <p className="text-sm text-gray-600">가용 주차면</p>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-blue-800">
          💡 <strong>실시간 업데이트:</strong> 모든 데이터는 2분마다 자동으로 갱신됩니다.
        </p>
      </div>
    </div>
  );
}

export default Home;
