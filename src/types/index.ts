export interface News {
  title: string;
  content: string;
  source: string;
  date: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  reliability: number;
}

export type ScoreValue = { total: number } | number | undefined;

export interface Scores {
  infrastructure: ScoreValue;
  market: ScoreValue;
  workforce: ScoreValue;
  regulatory: ScoreValue;
  sustainability: ScoreValue;
}

export interface UserWeights {
  infrastructure: number;
  market: number;
  workforce: number;
  regulatory: number;
  sustainability: number;
}

export interface CountryScore {
  name: string;
  country: string;
  scores: Scores;
  totalScore: number;
  rank: number;
  newsAnalysis?: {
    sentiment: string;
    summary: string;
  };
}

export interface HistoricalScore {
  date: Date;
  scores: Scores;
}

export interface Country {
  name: string;
  scores: Scores;
  news: News[];
  history: HistoricalScore[];
  lastUpdated: Date;
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