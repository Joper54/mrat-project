import axios from 'axios';
import { CountryScore, HistoricalScore } from '../types';
import { analyzeNewsWithAI } from './aiNewsAnalysis';

// Using environment variable if available, fallback to Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://mrat-backend.onrender.com';
const NEWSAPI_KEY = '6bc821b5eda24b81b83bb021781cff1d';
const DEEPSEEK_API_KEY = 'sk-25db6ab5fbbf4c62819e20659bd032d2';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Enhanced country code mapping
const countryCodeMap: Record<string, string> = {
  'Nigeria': 'ng',
  'Ghana': 'gh',
  'South Africa': 'za',
  'Kenya': 'ke',
  'Egypt': 'eg',
  'Morocco': 'ma',
  'Ethiopia': 'et',
  'Tanzania': 'tz',
  'Uganda': 'ug',
  'Rwanda': 'rw',
  'Senegal': 'sn',
  'Côte d\'Ivoire': 'ci',
  'Cameroon': 'cm',
  'DR Congo': 'cd',
  'Angola': 'ao'
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
  const code = countryCodeMap[country] || country;
  let articles: News[] = [];

  try {
    // Try NewsAPI first
    const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=${code}&apiKey=${NEWSAPI_KEY}`;
    const newsApiResponse = await fetch(newsApiUrl);
    if (newsApiResponse.ok) {
      const newsApiData = await newsApiResponse.json();
      articles = newsApiData.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        country: country
      }));
    }
  } catch (error) {
    console.error('NewsAPI error:', error);
  }

  // If NewsAPI fails or returns no articles, use DeepSeek
  if (articles.length === 0) {
    try {
      const deepseekUrl = `${DEEPSEEK_BASE_URL}/v1/chat/completions`;
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

      const response = await fetch(deepseekUrl, {
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
          max_tokens: 2000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newsData = JSON.parse(data.choices[0].message.content);
        articles = newsData.articles.map((article: any) => ({
          ...article,
          country: country
        }));
      }
    } catch (error) {
      console.error('DeepSeek news error:', error);
    }
  }

  return { articles };
};

export const fetchCountryData = async (country: string) => {
  const code = countryCodeMap[country] || country;
  let countryData = null;

  try {
    // Use DeepSeek for comprehensive analysis
    const deepseekUrl = `${DEEPSEEK_BASE_URL}/v1/chat/completions`;
    const prompt = `Analyze the current state of ${country} and provide detailed development indicators. Return the results in this JSON format:
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
        "infrastructure": {
          "road_rail_index": "Score out of 10",
          "energy_reliability": "Score out of 10",
          "port_performance": "Score out of 10",
          "total": "Total score out of 10"
        },
        "regulatory": {
          "doing_business_score": "Score out of 10",
          "import_export_procedures": "Score out of 10",
          "legal_predictability": "Score out of 10",
          "total": "Total score out of 10"
        },
        "market_demand": {
          "manufacturing_gdp": "Score out of 10",
          "industrial_growth": "Score out of 10",
          "active_projects": "Score out of 10",
          "total": "Total score out of 10"
        },
        "stability": {
          "inflation_volatility": "Score out of 10",
          "fdi_flows": "Score out of 10",
          "political_stability": "Score out of 10",
          "total": "Total score out of 10"
        },
        "partnership": {
          "local_firms": "Score out of 10",
          "skilled_labor": "Score out of 10",
          "ppp_openness": "Score out of 10",
          "total": "Total score out of 10"
        }
      },
      "rank": "Current rank among African countries",
      "total_score": "Overall score out of 10",
      "last_updated": "Current timestamp"
    }`;

    const response = await fetch(deepseekUrl, {
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
            content: 'You are an expert in African development indicators and analysis. Provide detailed, accurate data with specific examples and sources when available.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      })
    });

    if (response.ok) {
      const data = await response.json();
      countryData = JSON.parse(data.choices[0].message.content);
    }
  } catch (error) {
    console.error('DeepSeek country data error:', error);
  }

  // If DeepSeek fails, use OpenRouter as fallback
  if (!countryData && OPENROUTER_API_KEY) {
    try {
      const openrouterUrl = `${OPENROUTER_BASE_URL}/chat/completions`;
      const response = await fetch(openrouterUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-opus-20240229',
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
          max_tokens: 2500
        })
      });

      if (response.ok) {
        const data = await response.json();
        countryData = JSON.parse(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('OpenRouter country data error:', error);
    }
  }

  return countryData || {
    indicators: {},
    scores: {
      infrastructure: { total: 0 },
      regulatory: { total: 0 },
      market_demand: { total: 0 },
      stability: { total: 0 },
      partnership: { total: 0 }
    },
    rank: 0,
    total_score: 0,
    last_updated: new Date().toISOString()
  };
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