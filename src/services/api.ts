import axios from 'axios';
import { CountryScore, UserWeights } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const addCountryNews = async (countryName: string, news: any) => {
  try {
    const response = await axios.post(`${API_URL}/countries/${countryName}/news`, news);
    return response.data;
  } catch (error) {
    console.error(`Error adding news for ${countryName}:`, error);
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