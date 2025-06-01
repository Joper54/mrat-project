import React, { useState, useEffect } from 'react';
import CountryRankings from './CountryRankings';
import CountryComparison from './CountryComparison';
import CountrySelector from './CountrySelector';
import { fetchAllScores } from '../services/api';
import { CountryScore } from '../types';

const TABS = [
  { key: 'manual', label: 'Manual Assessment' },
  { key: 'ai', label: 'AI/Real-Time Data' },
  { key: 'news', label: 'News Feed' },
];

function ManualAssessmentTab() {
  return <div>Manual Assessment: User can adjust scores here. (To be implemented)</div>;
}

function AIDataTab({ countries, selectedCountries, setSelectedCountries, loading }: any) {
  return (
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
  );
}

function NewsFeedTab() {
  return <div>News Feed: Shows news and analysis. (To be implemented)</div>;
}

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('manual');
  const [countries, setCountries] = useState<CountryScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchAllScores();
      setCountries(data);
      if (data.length > 0) {
        const topThree = data
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 3)
          .map(country => country.country);
        setSelectedCountries(topThree);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex border-b mb-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-semibold ${activeTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'manual' && <ManualAssessmentTab />}
      {activeTab === 'ai' && (
        <AIDataTab
          countries={countries}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          loading={loading}
        />
      )}
      {activeTab === 'news' && <NewsFeedTab />}
    </div>
  );
} 