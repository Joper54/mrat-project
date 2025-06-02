import React, { useState } from 'react';
import { InfoIcon } from 'lucide-react';
import CountriesTable from './CountriesTable';
import CountryComparisonChart from './CountryComparisonChart';
import CountryRadarChart from './CountryRadarChart';
import FactorWeightEditor from './FactorWeightEditor';
import NewsFeed from './NewsFeed';
import { Country, FactorWeight, NewsItem } from '../types';

interface DashboardProps {
  countries: Country[];
  factorWeights: FactorWeight[];
  newsItems: NewsItem[];
  onUpdateWeights: (weights: FactorWeight[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  countries, 
  factorWeights, 
  newsItems,
  onUpdateWeights
}) => {
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>([
    countries[0]?.id, 
    countries[1]?.id
  ]);
  
  const selectedCountries = countries.filter(
    country => selectedCountryIds.includes(country.id)
  );
  
  const handleCountryToggle = (countryId: string) => {
    if (selectedCountryIds.includes(countryId)) {
      // Don't remove if it's the last country
      if (selectedCountryIds.length > 1) {
        setSelectedCountryIds(selectedCountryIds.filter(id => id !== countryId));
      }
    } else {
      setSelectedCountryIds([...selectedCountryIds, countryId]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <h3 className="text-lg font-medium text-neutral-600 mb-1">Countries Analyzed</h3>
              <p className="text-3xl font-bold text-primary-600">{countries.length}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-lg font-medium text-neutral-600 mb-1">Top Ranked</h3>
              <p className="text-3xl font-bold text-primary-600">
                {countries.length > 0 ? countries[0].name : 'N/A'}
              </p>
            </div>
            <div className="card p-4">
              <h3 className="text-lg font-medium text-neutral-600 mb-1">Avg Score</h3>
              <p className="text-3xl font-bold text-primary-600">
                {countries.length > 0 
                  ? (countries.reduce((sum, c) => sum + (c.totalScore || 0), 0) / countries.length).toFixed(1)
                  : 'N/A'
                }
              </p>
            </div>
          </div>
          
          {/* Country Rankings Table */}
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Country Rankings</h2>
              <div className="flex items-center text-sm text-gray-500">
                <InfoIcon className="h-4 w-4 mr-1" />
                <span>Updated daily at 00:00 UTC</span>
              </div>
            </div>
            <div className="p-4">
              <CountriesTable 
                countries={countries} 
                factorWeights={factorWeights}
                selectedCountryIds={selectedCountryIds}
                onCountryToggle={handleCountryToggle}
              />
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold">Score Comparison</h2>
              </div>
              <div className="p-4 h-[300px]">
                <CountryComparisonChart countries={selectedCountries} />
              </div>
            </div>
            <div className="card">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold">Factor Analysis</h2>
              </div>
              <div className="p-4 h-[300px]">
                <CountryRadarChart countries={selectedCountries} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Factor Weights */}
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold">Factor Weights</h2>
            </div>
            <div className="p-4">
              <FactorWeightEditor 
                weights={factorWeights} 
                onUpdateWeights={onUpdateWeights} 
              />
            </div>
          </div>
          
          {/* News Feed */}
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold">Latest News</h2>
            </div>
            <div className="p-4">
              <NewsFeed newsItems={newsItems} countries={countries} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;