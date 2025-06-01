import { CountryScore, HistoricalScore, UserWeights } from '../types';
import { fetchAllCountriesData, fetchCountryNews, fetchCountryHistory as fetchAimlCountryHistory } from './aimlApi';

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

export const fetchAllScores = async (weights?: UserWeights): Promise<CountryScore[]> => {
  try {
    return await fetchAllCountriesData(weights);
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw new Error('Failed to fetch country data');
  }
};

export const fetchNews = async (country: string) => {
  try {
    return await fetchCountryNews(country);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news data');
  }
};

export const fetchCountryHistory = async (country: string): Promise<HistoricalScore[]> => {
  try {
    return await fetchAimlCountryHistory(country);
  } catch (error) {
    console.error('Error fetching country history:', error);
    throw new Error('Failed to fetch country history');
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