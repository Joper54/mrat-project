import React, { useState, useEffect } from 'react';
import { fetchAllScores } from './services/api';
import { CountryScore, UserWeights } from './types';
import WeightAdjuster from './components/WeightAdjuster';
import CountryTable from './components/CountryTable';
import RadarChart from './components/RadarChart';

function App() {
  const [countries, setCountries] = useState<CountryScore[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCountries = async (weights?: UserWeights) => {
    try {
      setLoading(true);
      const data = await fetchAllScores(weights);
      setCountries(data);
      if (!selectedCountry && data.length > 0) {
        setSelectedCountry(data[0].country);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load country data');
      console.error('Error loading countries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleWeightsChange = (weights: UserWeights) => {
    loadCountries(weights);
  };

  const selectedCountryData = countries.find(c => c.country === selectedCountry);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Country Ranking Analysis
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WeightAdjuster onWeightsChange={handleWeightsChange} />
          {selectedCountryData && (
            <RadarChart
              scores={selectedCountryData.scores}
              country={selectedCountryData.country}
            />
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        ) : (
          <CountryTable countries={countries} />
        )}
      </div>
    </div>
  );
}

export default App;