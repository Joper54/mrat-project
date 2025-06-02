import { useState } from 'react';
import { useCountryData } from './hooks/useCountryData';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CountriesTable from './components/CountriesTable';
import CountryComparisonChart from './components/CountryComparisonChart';
import CountryRadarChart from './components/CountryRadarChart';
import FactorWeightEditor from './components/FactorWeightEditor';
import NewsFeed from './components/NewsFeed';

function App() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>();
  const {
    countries,
    selectedCountry,
    news,
    loading,
    error,
    setSelectedCountryCode: updateSelectedCountry
  } = useCountryData(selectedCountryCode);

  const handleCountrySelect = (code: string) => {
    setSelectedCountryCode(code);
    updateSelectedCountry(code);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Dashboard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <CountriesTable
                countries={countries}
                onCountrySelect={handleCountrySelect}
                loading={loading}
              />
              <CountryComparisonChart
                countries={countries}
                selectedCountry={selectedCountry}
                loading={loading}
              />
            </div>
            <div className="space-y-8">
              <CountryRadarChart
                country={selectedCountry}
                loading={loading}
              />
              <FactorWeightEditor />
              <NewsFeed news={news} loading={loading} />
            </div>
          </div>
        </Dashboard>
      </main>
      <Footer />
    </div>
  );
}

export default App;