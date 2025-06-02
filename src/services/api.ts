import axios from 'axios';
import { CountryScore, UserWeights } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://mrat-backend.onrender.com/api';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const fetchAllScores = async (weights?: UserWeights): Promise<CountryScore[]> => {
  try {
    const response = await axios.get(`${API_URL}/countries`);
    const countries = response.data;

    return countries.map((country: any) => {
      const scores = country.scores;
      const totalScore = calculateTotalScore(scores, weights);
      
      return {
        country: country.name,
        scores,
        totalScore,
        rank: 0 // Will be calculated after sorting
      };
    }).sort((a: CountryScore, b: CountryScore) => b.totalScore - a.totalScore)
      .map((country: CountryScore, index: number) => ({
        ...country,
        rank: index + 1
      }));
  } catch (error) {
    console.error('Error fetching country scores:', error);
    throw error;
  }
};

export const fetchCountryData = async (countryName: string) => {
  try {
    const response = await axios.get(`${API_URL}/countries/${countryName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${countryName}:`, error);
    throw error;
  }
};

export const updateCountryScores = async (countryName: string, scores: any) => {
  try {
    const response = await axios.put(`${API_URL}/countries/${countryName}/scores`, { scores });
    return response.data;
  } catch (error) {
    console.error(`Error updating scores for ${countryName}:`, error);
    throw error;
  }
};

const calculateTotalScore = (scores: any, weights?: UserWeights): number => {
  if (!weights) {
    return Object.values(scores).reduce((sum: number, score: any) => sum + score, 0) / 5;
  }

  return (
    scores.infrastructure * weights.infrastructure +
    scores.market * weights.market +
    scores.workforce * weights.workforce +
    scores.regulatory * weights.regulatory +
    scores.sustainability * weights.sustainability
  );
};

export const exportToExcel = (countries: CountryScore[]) => {
  // Create CSV content
  const headers = ['Rank', 'Country', 'Total Score', 'Infrastructure', 'Regulatory', 'Market Demand', 'Stability', 'Partnership'];
  const rows = countries.map(country => [
    country.rank,
    country.country,
    country.totalScore.toFixed(2),
    country.scores.infrastructure.toFixed(2),
    country.scores.regulatory.toFixed(2),
    country.scores.market.toFixed(2),
    country.scores.workforce.toFixed(2),
    country.scores.sustainability.toFixed(2)
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
  link.setAttribute('download', 'country_rankings.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export interface CountryData {
  name: string;
  code: string;
  gdp: number;
  population: number;
  happiness: number;
  education: number;
  healthcare: number;
  environment: number;
  safety: number;
  infrastructure: number;
  innovation: number;
  corruption: number;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export const api = {
  async getCountries(): Promise<CountryData[]> {
    const response = await axios.get(`${API_URL}/countries`);
    return response.data;
  },

  async getCountryDetails(code: string): Promise<CountryData> {
    const response = await axios.get(`${API_URL}/countries/${code}`);
    return response.data;
  },

  async getNews(countryCode: string): Promise<NewsItem[]> {
    const response = await axios.get(`${API_URL}/news/${countryCode}`, {
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      }
    });
    return response.data.articles;
  }
};