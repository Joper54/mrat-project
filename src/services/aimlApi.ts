import axios from 'axios';
import { CountryScore, UserWeights } from '../types';

const AIML_API_KEY = import.meta.env.VITE_AIML_API_KEY || '0ee9fcb0dc9c48eb95f182c2908da717';
const AIML_BASE_URL = import.meta.env.VITE_AIML_API_URL || 'https://api.aimlapi.com/v1';

const aimlApi = axios.create({
  baseURL: AIML_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AIML_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const fetchCountryData = async (country: string) => {
  try {
    const response = await aimlApi.get(`/countries/${country}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${country}:`, error);
    throw error;
  }
};

export const fetchAllCountriesData = async (weights?: UserWeights) => {
  try {
    const countries = ['Nigeria', 'Ghana', 'South Africa', 'Kenya', 'Egypt', 'Morocco'];
    const countryData = await Promise.all(
      countries.map(country => fetchCountryData(country))
    );

    // Transform the data to match our application's format
    const transformedData: CountryScore[] = countryData.map((data, index) => ({
      _id: data.id || `country-${index}`,
      country: data.name,
      date: new Date().toISOString(),
      scores: {
        infrastructure: {
          road_rail_index: data.infrastructure?.road_rail_index || 0,
          energy_reliability: data.infrastructure?.energy_reliability || 0,
          port_performance: data.infrastructure?.port_performance || 0,
          total: data.infrastructure?.total || 0
        },
        regulatory: {
          doing_business_score: data.regulatory?.doing_business_score || 0,
          import_export_procedures: data.regulatory?.import_export_procedures || 0,
          legal_predictability: data.regulatory?.legal_predictability || 0,
          total: data.regulatory?.total || 0
        },
        market_demand: {
          manufacturing_gdp: data.market_demand?.manufacturing_gdp || 0,
          industrial_growth: data.market_demand?.industrial_growth || 0,
          active_projects: data.market_demand?.active_projects || 0,
          total: data.market_demand?.total || 0
        },
        stability: {
          inflation_volatility: data.stability?.inflation_volatility || 0,
          fdi_flows: data.stability?.fdi_flows || 0,
          political_stability: data.stability?.political_stability || 0,
          total: data.stability?.total || 0
        },
        partnership: {
          local_firms: data.partnership?.local_firms || 0,
          skilled_labor: data.partnership?.skilled_labor || 0,
          ppp_openness: data.partnership?.ppp_openness || 0,
          total: data.partnership?.total || 0
        }
      },
      weights: weights || {
        infrastructure: 0.25,
        regulatory: 0.20,
        market_demand: 0.25,
        stability: 0.15,
        partnership: 0.15
      },
      total_score: data.total_score || 0,
      rank: data.rank || 0,
      news: data.news || [],
      last_updated: new Date().toISOString()
    }));

    // Sort by total score and update ranks
    transformedData.sort((a, b) => b.total_score - a.total_score);
    transformedData.forEach((country, index) => {
      country.rank = index + 1;
    });

    return transformedData;
  } catch (error) {
    console.error('Error fetching all countries data:', error);
    throw error;
  }
};

export const fetchCountryNews = async (country: string) => {
  try {
    const response = await aimlApi.get(`/countries/${country}/news`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news for ${country}:`, error);
    throw error;
  }
};

export const fetchCountryHistory = async (country: string) => {
  try {
    const response = await aimlApi.get(`/countries/${country}/history`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for ${country}:`, error);
    throw error;
  }
}; 