export interface News {
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: string;
  country?: string;
}

export interface Scores {
  infrastructure: {
    road_rail_index: number;
    energy_reliability: number;
    port_performance: number;
    total: number;
  };
  regulatory: {
    doing_business_score: number;
    import_export_procedures: number;
    legal_predictability: number;
    total: number;
  };
  market_demand: {
    manufacturing_gdp: number;
    industrial_growth: number;
    active_projects: number;
    total: number;
  };
  stability: {
    inflation_volatility: number;
    fdi_flows: number;
    political_stability: number;
    total: number;
  };
  partnership: {
    local_firms: number;
    skilled_labor: number;
    ppp_openness: number;
    total: number;
  };
}

export interface UserWeights {
  infrastructure: number;
  regulatory: number;
  market_demand: number;
  stability: number;
  partnership: number;
}

export interface CountryScore {
  _id: string;
  country: string;
  date: string;
  scores: Scores;
  weights: UserWeights;
  total_score: number;
  rank: number;
  last_updated: string;
}

export interface HistoricalScore {
  date: string;
  scores: Scores;
  total_score: number;
}

export interface NewsAnalysis {
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyPoints: string[];
  implications: string[];
  recommendations: string[];
  sources: Array<{
    title: string;
    url: string;
    reliability: 'high' | 'medium' | 'low';
  }>;
  timestamp: string;
}