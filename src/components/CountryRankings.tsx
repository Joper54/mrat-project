import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Minus, Medal } from 'lucide-react';
import { CountryScore } from '../types';
import { getScoreColor } from '../utils/formatters';

interface CountryRankingsProps {
  countries: CountryScore[];
  loading: boolean;
}

const CountryRankings: React.FC<CountryRankingsProps> = ({ countries, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  const medalColors = [
    'text-yellow-500',
    'text-gray-400',
    'text-amber-600',
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overall Score</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {countries.map((country) => (
              <tr 
                key={country._id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {country.rank <= 3 ? (
                      <Medal className={`mr-2 ${medalColors[country.rank - 1]}`} size={18} />
                    ) : null}
                    <span 
                      className={`text-sm font-medium ${
                        country.rank <= 3 ? medalColors[country.rank - 1] : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {country.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to={`/country/${country.country}`} 
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {country.country}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${country.total_score * 10}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(country.total_score)}`}>
                      {country.total_score.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs">
                    <ArrowUp className="text-green-500 mr-1" size={16} />
                    <span className="text-green-500">Stable</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountryRankings;