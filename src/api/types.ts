// API 타입 정의
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
  data: any;
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