import { apiClient } from './client';
import type { AreaInfo, CrowdData, SubwayStation, ParkingLot, RankingItem } from './types';

// 아래 interface 정의들은 모두 삭제 (types.ts로 옮겼으므로)

// 타입 정의
export interface AreaInfo {
  category: string;
  no: number;
  areaCode: string;
  areaName: string;
  engName?: string;
}

export interface CrowdData {
  areaCode: string;
  areaInfo: AreaInfo;
  data: any; // 서울시 API 응답 데이터
  fetchedAt: string;
}

export interface SubwayStation {
  stationId: string;
  stationName: string;
  line: string;
  congestion: string;
  level: number;
  updatedAt: string;
}

export interface ParkingLot {
  parkingCode: string;
  parkingName: string;
  addr: string;
  latitude: number;
  longitude: number;
  capacity: number;
  curParking: number;
  available: number;
  payYn: string;
  operatingTime?: string;
  rates?: string;
}

export interface RankingItem {
  areaCode: string;
  areaName: string;
  avgPopulation: number;
  rank: number;
}

// API 서비스 함수들

/**
 * 인파 밀집도 API
 */
export const crowdApi = {
  // 전체 인파 밀집도 조회
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: CrowdData[] }>(
      '/api/crowds'
    );
    return response.data;
  },

  // 특정 지역 인파 밀집도 조회
  getByAreaCode: async (areaCode: string) => {
    const response = await apiClient.get<{ success: boolean; data: CrowdData }>(
      `/api/crowds/${areaCode}`
    );
    return response.data;
  },
};

/**
 * 지하철 혼잡도 API
 */
export const subwayApi = {
  // 전체 지하철 혼잡도 조회
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: SubwayStation[] }>(
      '/api/subway'
    );
    return response.data;
  },

  // 특정 역 혼잡도 조회
  getByStationId: async (stationId: string) => {
    const response = await apiClient.get<{ success: boolean; data: SubwayStation }>(
      `/api/subway/${stationId}`
    );
    return response.data;
  },
};

/**
 * 주차장 정보 API
 */
export const parkingApi = {
  // 전체 주차장 정보 조회
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: ParkingLot[] }>(
      '/api/parking'
    );
    return response.data;
  },

  // 특정 주차장 정보 조회
  getByCode: async (parkingCode: string) => {
    const response = await apiClient.get<{ success: boolean; data: ParkingLot }>(
      `/api/parking/${parkingCode}`
    );
    return response.data;
  },

  // 주변 주차장 검색 (좌표 기반)
  searchNearby: async (lat: number, lng: number, radius: number = 1) => {
    const response = await apiClient.get<{ success: boolean; data: ParkingLot[] }>(
      '/api/parking/nearby',
      {
        params: { lat, lng, radius },
      }
    );
    return response.data;
  },
};

/**
 * 랭킹 API
 */
export const rankingApi = {
  // 인기 장소 랭킹 조회
  getTopPlaces: async (limit: number = 10) => {
    const response = await apiClient.get<{ success: boolean; data: RankingItem[] }>(
      '/api/rankings',
      {
        params: { limit },
      }
    );
    return response.data;
  },
};

/**
 * 지역 정보 API
 */
export const areaApi = {
  // 전체 지역 조회
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: AreaInfo[] }>(
      '/api/areas'
    );
    return response.data;
  },

  // 카테고리별 지역 조회
  getByCategory: async (category: string) => {
    const response = await apiClient.get<{ success: boolean; data: AreaInfo[] }>(
      '/api/areas',
      {
        params: { category },
      }
    );
    return response.data;
  },

  // 지역 검색
  search: async (query: string) => {
    const response = await apiClient.get<{ success: boolean; data: AreaInfo[] }>(
      '/api/areas/search',
      {
        params: { q: query },
      }
    );
    return response.data;
  },
};
