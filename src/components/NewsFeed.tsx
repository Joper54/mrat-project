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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors h-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {countryName} News
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No news articles available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {countryName} News
      </h3>
      <div className="space-y-4">
        {news.map((article, index) => (
          <div 
            key={index} 
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center mb-1">
              <SentimentIcon sentiment={article.sentiment} />
              <h4 className="text-md font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mr-2">
                {article.title}
              </h4>
              <span className="ml-auto flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} className="mr-1" />
                {article.date ? formatTimeAgo(typeof article.date === 'string' ? article.date : article.date.toString()) : ''}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2 space-x-2">
              <span>{article.source}</span>
              {article.reliability !== undefined && (
                <span className="ml-2">Reliability: {(article.reliability * 100).toFixed(0)}%</span>
              )}
              <span className="ml-2">{article.date ? `Updated ${formatTimeAgo(typeof article.date === 'string' ? article.date : article.date.toString())}` : ''}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {article.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;