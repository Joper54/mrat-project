import axios from 'axios';
import { CountryScore, HistoricalScore, UserWeights } from '../types';

// Using environment variable if available, fallback to Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://mrat-backend.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock data for demonstration
const mockCountries = [
  'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'Egypt', 'Morocco',
  'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Côte d\'Ivoire',
  'Cameroon', 'DR Congo', 'Angola'
];

const generateMockScores = (country: string) => ({
  infrastructure: {
    road_rail_index: Math.random() * 10,
    energy_reliability: Math.random() * 10,
    port_performance: Math.random() * 10,
    total: 0
  },
  regulatory: {
    doing_business_score: Math.random() * 10,
    import_export_procedures: Math.random() * 10,
    legal_predictability: Math.random() * 10,
    total: 0
  },
  market_demand: {
    manufacturing_gdp: Math.random() * 10,
    industrial_growth: Math.random() * 10,
    active_projects: Math.random() * 10,
    total: 0
  },
  stability: {
    inflation_volatility: Math.random() * 10,
    fdi_flows: Math.random() * 10,
    political_stability: Math.random() * 10,
    total: 0
  },
  partnership: {
    local_firms: Math.random() * 10,
    skilled_labor: Math.random() * 10,
    ppp_openness: Math.random() * 10,
    total: 0
  }
});

const calculateTotalScores = (scores: any, weights: UserWeights) => {
  const categories = ['infrastructure', 'regulatory', 'market_demand', 'stability', 'partnership'];
  let totalScore = 0;

  categories.forEach(category => {
    const categoryScores = scores[category];
    const categoryWeight = weights[category as keyof UserWeights];
    
    // Calculate category total
    const categoryTotal = Object.entries(categoryScores)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, value]) => sum + (value as number), 0) / 3;
    
    categoryScores.total = categoryTotal;
    totalScore += categoryTotal * categoryWeight;
  });

  return totalScore;
};

export const fetchAllScores = async (userWeights?: UserWeights): Promise<CountryScore[]> => {
  try {
    // Generate mock data
    const defaultWeights: UserWeights = {
      infrastructure: 0.2,
      regulatory: 0.2,
      market_demand: 0.2,
      stability: 0.2,
      partnership: 0.2
    };

    const weights = userWeights || defaultWeights;
    const scores = mockCountries.map(country => {
      const countryScores = generateMockScores(country);
      const total_score = calculateTotalScores(countryScores, weights);
      
      return {
        _id: Math.random().toString(36).substr(2, 9),
        country,
        date: new Date().toISOString(),
        scores: countryScores,
        weights,
        total_score,
        rank: 0,
        last_updated: new Date().toISOString()
      };
    });

    // Sort by total score and assign ranks
    scores.sort((a, b) => b.total_score - a.total_score);
    scores.forEach((score, index) => {
      score.rank = index + 1;
    });

    return scores;
  } catch (error) {
    console.error('Error generating mock scores:', error);
    throw new Error('Failed to generate mock scores');
  }
};

export const fetchCountryHistory = async (country: string): Promise<HistoricalScore[]> => {
  try {
    // Generate mock historical data
    const history: HistoricalScore[] = [];
    const months = 12;
    
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const scores = generateMockScores(country);
      const total_score = calculateTotalScores(scores, {
        infrastructure: 0.2,
        regulatory: 0.2,
        market_demand: 0.2,
        stability: 0.2,
        partnership: 0.2
      });

      history.push({
        date: date.toISOString(),
        scores,
        total_score
      });
    }

    return history;
  } catch (error) {
    console.error('Error generating mock history:', error);
    throw new Error('Failed to generate mock history');
  }
};

export const exportToExcel = (data: CountryScore[]) => {
  // Convert data to CSV format
  const headers = [
    'Country',
    'Rank',
    'Total Score',
    'Infrastructure Score',
    'Regulatory Score',
    'Market Demand Score',
    'Stability Score',
    'Partnership Score'
  ];

  const rows = data.map(country => [
    country.country,
    country.rank,
    country.total_score.toFixed(2),
    country.scores.infrastructure.total.toFixed(2),
    country.scores.regulatory.total.toFixed(2),
    country.scores.market_demand.total.toFixed(2),
    country.scores.stability.total.toFixed(2),
    country.scores.partnership.total.toFixed(2)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `country_rankings_${new Date().toISOString()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};