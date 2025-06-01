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
      console.log('Loading countries with weights:', weights);
      const data = await fetchAllScores(weights);
      console.log('Received data:', data);
      setCountries(data);
      if (!selectedCountry && data.length > 0) {
        setSelectedCountry(data[0].country);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load country data';
      console.error('Error loading countries:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('App mounted, environment:', {
      apiKey: import.meta.env.VITE_AIML_API_KEY ? 'Present' : 'Missing',
      apiUrl: import.meta.env.VITE_AIML_API_URL
    });
    loadCountries();
  }, []);

  const handleWeightsChange = (weights: UserWeights) => {
    loadCountries(weights);
  };

  const selectedCountryData = countries.find(c => c.country === selectedCountry);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Application</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => loadCountries()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Country Ranking Analysis
        </h1>

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