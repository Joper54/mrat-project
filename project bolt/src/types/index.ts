export interface Country {
  id: string;
  name: string;
  code: string;
  flagUrl: string;
  scores: {
    infrastructure: number;
    regulation: number;
    marketDemand: number;
    stability: number;
    partnerships: number;
  };
  totalScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  countryCode?: string;
  relevantFactor?: FactorType;
}

export type FactorType = 'infrastructure' | 'regulation' | 'marketDemand' | 'stability' | 'partnerships';

export interface FactorWeight {
  factor: FactorType;
  weight: number;
  displayName: string;
  description: string;
}

export interface ApiSource {
  id: string;
  name: string;
  description: string;
  url: string;
  dataPoints: string[];
}