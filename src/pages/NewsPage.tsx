import React, { useState, useEffect } from 'react';
import { AlertTriangle, Filter } from 'lucide-react';
import NewsFeed from '../components/NewsFeed';
import { fetchAllScores } from '../services/api';
import { CountryScore, News } from '../types';

const NewsPage: React.FC = () => {
  const [countries, setCountries] = useState<CountryScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | 'all'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllScores();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAllNews = (): {country: string, news: News[]}[] => {
    if (selectedCountry === 'all') {
      return countries.map(country => ({
        country: country.country,
        news: country.news
      }));
    }
    
    const country = countries.find(c => c.country === selectedCountry);
    return country ? [{ country: country.country, news: country.news }] : [];
  };

  const allCountryNews = getAllNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Industry News Feed
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Latest manufacturing and industrial news by country
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors mb-6">
        <div className="flex items-center">
          <Filter size={18} className="text-gray-500 mr-2" />
          <span className="text-gray-700 dark:text-gray-300 mr-4">Filter by country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country._id} value={country.country}>
                {country.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <NewsFeed
              key={i}
              news={[]}
              countryName="Loading..."
              loading={true}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {allCountryNews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center transition-colors">
              <p className="text-gray-500 dark:text-gray-400">No news available for the selected country</p>
            </div>
          ) : (
            allCountryNews.map((item, index) => (
              <NewsFeed
                key={index}
                news={item.news}
                countryName={item.country}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;