import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { Country, FactorWeight, NewsItem, ApiSource } from './types';
import { COUNTRY_DATA, FACTOR_WEIGHTS, NEWS_ITEMS, API_SOURCES } from './data/mockData';
import { processCountryData } from './utils/scoreCalculator';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [factorWeights, setFactorWeights] = useState<FactorWeight[]>(FACTOR_WEIGHTS);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(NEWS_ITEMS);
  const [apiSources, setApiSources] = useState<ApiSource[]>(API_SOURCES);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Process country data on initial load and when weights change
  useEffect(() => {
    const processedData = processCountryData(COUNTRY_DATA, factorWeights);
    setCountries(processedData);
    setLastUpdated(new Date().toISOString());
  }, [factorWeights]);
  
  const handleUpdateWeights = (newWeights: FactorWeight[]) => {
    setFactorWeights(newWeights);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Slightly randomize scores to simulate new data
      const refreshedData = COUNTRY_DATA.map(country => {
        const newScores = { ...country.scores };
        Object.keys(newScores).forEach(key => {
          const factor = key as keyof typeof newScores;
          // Random adjustment between -0.3 and +0.3
          const adjustment = (Math.random() * 0.6) - 0.3;
          newScores[factor] = Math.min(10, Math.max(1, newScores[factor] + adjustment));
        });
        
        return {
          ...country,
          scores: newScores,
          lastUpdated: new Date().toISOString()
        };
      });
      
      const processedData = processCountryData(refreshedData, factorWeights);
      setCountries(processedData);
      setLastUpdated(new Date().toISOString());
      setIsRefreshing(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        lastUpdated={lastUpdated} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
      />
      
      <main className="flex-grow">
        <Dashboard 
          countries={countries}
          factorWeights={factorWeights}
          newsItems={newsItems}
          onUpdateWeights={handleUpdateWeights}
        />
      </main>
      
      <Footer apiSources={apiSources} />
    </div>
  );
}

export default App;