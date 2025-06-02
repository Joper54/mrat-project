import React from 'react';
import { ExternalLink, Clock, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { News } from '../types';
import { formatDate, formatTimeAgo, aspectNameMap } from '../utils/formatters';

interface NewsFeedProps {
  news: News[];
  countryName: string;
  loading?: boolean;
}

const SentimentIcon: React.FC<{ sentiment: string }> = ({ sentiment }) => {
  if (sentiment === 'positive') return <ArrowUp className="text-green-500 inline-block mr-1" size={16} />;
  if (sentiment === 'negative') return <ArrowDown className="text-red-500 inline-block mr-1" size={16} />;
  return <Minus className="text-gray-400 inline-block mr-1" size={16} />;
};

const NewsFeed: React.FC<NewsFeedProps> = ({ news, countryName, loading = false }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white tracking-tight">
          Latest News
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No news articles available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white tracking-tight">
        Latest News
      </h2>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{item.content}</p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{item.source}</span> • <span>{formatDate(item.date.toString())}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;