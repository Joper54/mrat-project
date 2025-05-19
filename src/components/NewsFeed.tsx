import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { News } from '../types';
import { formatDate } from '../utils/formatters';

interface NewsFeedProps {
  news: News[];
  countryName: string;
  loading?: boolean;
}

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
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group"
            >
              <h4 className="text-md font-medium mb-1 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
                <ExternalLink size={14} className="inline-block ml-1 mb-1" />
              </h4>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="mr-2">{article.source}</span>
                <Clock size={12} className="mr-1" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              {article.summary && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {article.summary}
                </p>
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;