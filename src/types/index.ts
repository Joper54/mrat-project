export interface News {
  title: string;
  url: string;
  source: string;
  published_at: string;
  summary: string;
  sentiment: string;
  category: string;
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

export interface Weights {
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
  weights: Weights;
  total_score: number;
  rank: number;
  news: News[];
  last_updated: string;
}

export interface HistoricalScore {
  date: string;
  scores: Scores;
  total_score: number;
}