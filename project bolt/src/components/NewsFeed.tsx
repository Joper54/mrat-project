import React from 'react';
import { ExternalLink } from 'lucide-react';
import { NewsItem, Country } from '../types';
import { format, parseISO } from 'date-fns';

interface NewsFeedProps {
  newsItems: NewsItem[];
  countries: Country[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ newsItems, countries }) => {
  const getCountryName = (code: string | undefined) => {
    if (!code) return null;
    const country = countries.find(c => c.code === code);
    return country ? country.name : null;
  };
  
  const getFactorLabel = (factor: string | undefined) => {
    if (!factor) return null;
    
    const factorMap: Record<string, string> = {
      infrastructure: 'Infrastructure',
      regulation: 'Regulation',
      marketDemand: 'Market Demand',
      stability: 'Stability',
      partnerships: 'Partnerships'
    };
    
    return factorMap[factor] || null;
  };
  
  const getFactorColor = (factor: string | undefined) => {
    if (!factor) return 'bg-gray-100 text-gray-800';
    
    const colorMap: Record<string, string> = {
      infrastructure: 'bg-blue-100 text-blue-800',
      regulation: 'bg-purple-100 text-purple-800',
      marketDemand: 'bg-green-100 text-green-800',
      stability: 'bg-amber-100 text-amber-800',
      partnerships: 'bg-indigo-100 text-indigo-800'
    };
    
    return colorMap[factor] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {newsItems.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No news items available</p>
      ) : (
        newsItems.map(item => (
          <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-medium">{item.title}</h4>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>{item.source}</span>
              <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {item.countryCode && getCountryName(item.countryCode) && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {getCountryName(item.countryCode)}
                </span>
              )}
              
              {item.relevantFactor && getFactorLabel(item.relevantFactor) && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getFactorColor(item.relevantFactor)}`}>
                  {getFactorLabel(item.relevantFactor)}
                </span>
              )}
              
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
              >
                Read More <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsFeed;