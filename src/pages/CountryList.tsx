import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { fetchAllScores } from '../services/api';
import { CountryScore } from '../types';
import { aspectNameMap, getScoreColor, getScoreBgColor, getCountryFlagEmoji } from '../utils/formatters';

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
        {countries.map((country) => {
          // Get flag emoji (fallback to globe)
          const flag = getCountryFlagEmoji ? getCountryFlagEmoji(country.country) : '🌍';
          // Determine score color
          const score = country.totalScore || 0;
          let scoreColor = 'text-green-600';
          if (score < 5) scoreColor = 'text-red-500';
          else if (score < 7) scoreColor = 'text-yellow-500';
          // Trend icon (placeholder: always neutral)
          const TrendIcon = Minus;
          // Mini factor icons (use Lucide icons or emoji for demo)
          const factorIcons = {
            infrastructure: '🏗️',
            regulatory: '⚖️',
            market: '📈',
            workforce: '👷',
            sustainability: '🌱',
          };
          return (
            <div
              key={country.name || country.country}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors overflow-hidden flex flex-col justify-between border border-gray-100 dark:border-gray-700 hover:shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{flag}</span>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest">{country.country}</div>
                    <div className="text-lg font-bold text-gray-800 dark:text-white">{country.name}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-3xl font-extrabold ${scoreColor}`}>{score.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Readiness Score</span>
                  <div className="flex items-center mt-1">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full mr-2">#{country.rank || '-'}</span>
                    <TrendIcon className="text-gray-400" size={18} />
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-center mb-2">
                  {Object.entries(factorIcons).map(([key, icon]) => {
                    const scores = country.scores as any;
                    return (
                      <div key={key} className="flex flex-col items-center">
                        <span className="text-xl mb-1">{icon}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{aspectNameMap[key] || key}</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white mt-1">
                          {scores && scores[key] !== undefined ? (typeof scores[key] === 'number' ? scores[key] : (scores[key]?.total ?? 0)).toFixed(1) : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Latest News</h3>
                  {(country as any).news && (country as any).news.length > 0 ? (
                    <div>
                      <a
                        href={(country as any).news[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline line-clamp-2 group flex"
                      >
                        {(country as any).news[0].title}
                        <ExternalLink size={12} className="inline-block ml-1 mb-1 opacity-70 group-hover:opacity-100" />
                      </a>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{(country as any).news[0].source || 'Unknown source'}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">No recent news</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountryList;