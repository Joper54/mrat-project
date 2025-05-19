export interface News {
  title: string;
  url: string;
  source: string;
  published_at: string;
  summary: string;
}

export interface Scores {
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
  total_score: number;
  rank: number;
  news: News[];
}

export interface HistoricalScore extends CountryScore {
  date: string;
}