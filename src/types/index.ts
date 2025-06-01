export interface News {
  title: string;
  content: string;
  source: string;
  date: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  reliability: number;
}

export interface Scores {
  infrastructure: number;
  market: number;
  workforce: number;
  regulatory: number;
  sustainability: number;
}

export interface UserWeights {
  infrastructure: number;
  market: number;
  workforce: number;
  regulatory: number;
  sustainability: number;
}

export interface CountryScore {
  country: string;
  scores: Scores;
  totalScore: number;
  rank: number;
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