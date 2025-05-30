import axios from 'axios';
import { CountryScore, HistoricalScore } from '../types';
import { analyzeNewsWithAI } from './aiNewsAnalysis';

// Using environment variable if available, fallback to Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://mrat-backend.onrender.com';
const NEWSAPI_KEY = '6bc821b5eda24b81b83bb021781cff1d';
const DEEPSEEK_API_KEY = 'sk-25db6ab5fbbf4c62819e20659bd032d2';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Country name to 2-letter code mapping
const countryCodeMap: Record<string, string> = {
  'Nigeria': 'ng',
  'Ghana': 'gh',
  'South Africa': 'za',
  'Kenya': 'ke',
  'Egypt': 'eg',
  'Morocco': 'ma',
  // Add more as needed
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
let cachedData: any = null;
let lastFetchTime = 0;

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

export const fetchNews = async (country: string) => {
  if (!DEEPSEEK_API_KEY) throw new Error('DeepSeek API key not set');
  const code = countryCodeMap[country] || country;
  
  // First try to get news from DeepSeek's news endpoint
  const url = `${DEEPSEEK_BASE_URL}/v1/chat/completions`;
  const prompt = `Find the latest news articles about ${country}. Focus on development, economy, and social issues. Return the results in this JSON format:
  {
    "articles": [
      {
        "title": "Article title",
        "description": "Brief description",
        "url": "Source URL",
        "source": "News source name",
        "publishedAt": "Publication date"
      }
    ]
  }`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a news aggregator specializing in African development news.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) throw new Error('Failed to fetch news from DeepSeek');
  
  const data = await response.json();
  try {
    // Parse the response content as JSON
    const newsData = JSON.parse(data.choices[0].message.content);
    return newsData;
  } catch (error) {
    console.error('Error parsing news data:', error);
    return { articles: [] };
  }
};

export const fetchCountryData = async (country: string) => {
  if (!DEEPSEEK_API_KEY) throw new Error('DeepSeek API key not set');
  
  const url = `${DEEPSEEK_BASE_URL}/v1/chat/completions`;
  const prompt = `Analyze the current state of ${country} and provide development indicators. Return the results in this JSON format:
  {
    "indicators": {
      "gdp": "Current GDP value",
      "gdpGrowth": "GDP growth rate",
      "inflation": "Inflation rate",
      "unemployment": "Unemployment rate",
      "poverty": "Poverty rate",
      "education": "Education indicators",
      "health": "Health indicators"
    },
    "scores": {
      "economic": "Score out of 10",
      "social": "Score out of 10",
      "environmental": "Score out of 10",
      "governance": "Score out of 10",
      "infrastructure": "Score out of 10"
    },
    "rank": "Current rank among African countries",
    "total_score": "Overall score out of 10"
  }`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in African development indicators and analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) throw new Error('Failed to fetch country data from DeepSeek');
  
  const data = await response.json();
  try {
    // Parse the response content as JSON
    const countryData = JSON.parse(data.choices[0].message.content);
    return countryData;
  } catch (error) {
    console.error('Error parsing country data:', error);
    return {
      indicators: {},
      scores: {},
      rank: 0,
      total_score: 0
    };
  }
};

export const fetchAllCountries = async () => {
  const now = Date.now();
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedData;
  }

  if (!DEEPSEEK_API_KEY) throw new Error('DeepSeek API key not set');
  const url = `${DEEPSEEK_BASE_URL}/v1/all-countries`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch all countries data from DeepSeek');
  
  cachedData = await response.json();
  lastFetchTime = now;
  return cachedData;
};