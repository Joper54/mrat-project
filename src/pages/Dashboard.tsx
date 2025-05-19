import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import CountryRankings from '../components/CountryRankings';
import CountryComparison from '../components/CountryComparison';
import CountrySelector from '../components/CountrySelector';
import { fetchAllScores } from '../services/api';
import { CountryScore } from '../types';

const Dashboard: React.FC = () => {
  const [countries, setCountries] = useState<CountryScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllScores();
      setCountries(data);
      
      // Auto-select top 3 countries
      if (data.length > 0) {
        const topThree = data
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 3)
          .map(country => country.country);
        setSelectedCountries(topThree);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch country data. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Manufacturing Readiness Assessment Tool
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and compare manufacturing readiness across countries with real-time news and data analysis
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center px-3 py-1 text-sm text-red-500 hover:text-red-600 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Country Rankings
            </h2>
            <CountryRankings countries={countries} loading={loading} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Compare Countries
              </h2>
              <CountrySelector
                countries={countries}
                selectedCountries={selectedCountries}
                onChange={setSelectedCountries}
              />
            </div>
            <CountryComparison
              countries={countries}
              selectedCountries={selectedCountries}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Understanding the Scores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Infrastructure', description: 'Quality of roads, rails, ports, and energy supply' },
              { name: 'Regulatory', description: 'Ease of business, legal framework, and corruption levels' },
              { name: 'Market Demand', description: 'Manufacturing growth and GDP performance' },
              { name: 'Stability', description: 'Political climate, FDI trends, and economic risk' },
              { name: 'Partnership', description: 'Availability of skilled labor and local partnerships' },
            ].map((aspect, index) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                  {aspect.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {aspect.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;