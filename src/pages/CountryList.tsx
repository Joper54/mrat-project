import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { fetchAllScores } from '../services/api';
import { CountryScore } from '../types';
import { aspectNameMap, getScoreColor, getScoreBgColor } from '../utils/formatters';

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<CountryScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllScores();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch country data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/4 mb-8"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400 py-16">
          No countries available. Please check your data source or try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Countries Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed breakdown of manufacturing readiness scores by country
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <div
            key={country._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {country.country}
                </h2>
                <div className="flex items-center mt-1">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                    Rank #{country.rank}
                  </div>
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${getScoreBgColor(country.total_score)} ${getScoreColor(country.total_score)}`}>
                    {country.total_score.toFixed(1)}/10
                  </div>
                </div>
              </div>
              <Link
                to={`/country/${country.country}`}
                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
              >
                <span className="mr-1 text-sm">Details</span>
                <ExternalLink size={14} />
              </Link>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Score Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(country.scores).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-1/3">
                      {aspectNameMap[key] || key}
                    </span>
                    <div className="w-2/3 flex items-center">
                      <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                          style={{ width: `${value * 10}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap ${getScoreColor(value)}`}>
                        {value.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latest News
              </h3>
              {country.news && country.news.length > 0 ? (
                <div>
                  <a
                    href={country.news[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline line-clamp-2 group flex"
                  >
                    {country.news[0].title}
                    <ExternalLink size={12} className="inline-block ml-1 mb-1 opacity-70 group-hover:opacity-100" />
                  </a>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{country.news[0].source}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">No recent news</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryList;