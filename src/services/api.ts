import axios from 'axios';
import { CountryScore, HistoricalScore } from '../types';
import { analyzeNewsWithAI } from './aiNewsAnalysis';

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

export const fetchAllScores = async (): Promise<CountryScore[]> => {
  try {
    const response = await api.get('/api/scores');
    const scores = response.data;

    // Analyze news for each country
    for (const country of scores) {
      if (country.news && country.news.length > 0) {
        try {
          const sentimentAnalysis = await analyzeNewsWithAI(country.news);
          console.log(`Sentiment analysis for ${country.country}:`, sentimentAnalysis);
        } catch (error) {
          console.error(`Error analyzing news for ${country.country}:`, error);
        }
      }
    }

    return scores;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (!error.response) {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
    }
    throw new Error('An unexpected error occurred while fetching scores.');
  }
};

export const fetchCountryHistory = async (country: string): Promise<HistoricalScore[]> => {
  try {
    const response = await api.get(`/api/scores/${country}/history`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (!error.response) {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
    }
    throw new Error('An unexpected error occurred while fetching country history.');
  }
};