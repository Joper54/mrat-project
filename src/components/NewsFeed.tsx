import React from 'react';
import { NewsItem } from '../services/api';

interface NewsFeedProps {
  news: NewsItem[];
  loading: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Latest News
      </h3>
      <div className="space-y-4">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:bg-gray-50 p-4 rounded-lg transition-colors"
          >
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {item.title}
            </h4>
            <p className="text-sm text-gray-500 mb-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{item.source.name}</span>
              <span>
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;