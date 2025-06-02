import { useState, useEffect } from 'react';
import { api, CountryData, NewsItem } from '../services/api';

export const useCountryData = (initialCountryCode?: string) => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | undefined>(initialCountryCode);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await api.getCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch countries data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      if (!selectedCountryCode) return;

      try {
        setLoading(true);
        const data = await api.getCountryDetails(selectedCountryCode);
        setSelectedCountry(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch country details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [selectedCountryCode]);

  useEffect(() => {
    const fetchNews = async () => {
      if (!selectedCountryCode) return;

      try {
        setLoading(true);
        const data = await api.getNews(selectedCountryCode);
        setNews(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCountryCode]);

  return {
    countries,
    selectedCountry,
    news,
    loading,
    error,
    setSelectedCountryCode
  };
}; 