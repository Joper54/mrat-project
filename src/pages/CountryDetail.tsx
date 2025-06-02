import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import ScoreBreakdown from '../components/ScoreBreakdown';
import NewsFeed from '../components/NewsFeed';
import HistoricalChart from '../components/HistoricalChart';
import { fetchAllScores } from '../services/api';
import { CountryScore, Scores } from '../types';
import { aspectNameMap } from '../utils/formatters';

const CountryDetail: React.FC = () => {
  const { countryName } = useParams<{ countryName: string }>();
  const [countryData, setCountryData] = useState<CountryScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<keyof Scores | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current data
        const allScores = await fetchAllScores();
        const currentCountry = allScores.find(c => c.country === countryName);
        
        if (!currentCountry) {
          setError(`Country "${countryName}" not found`);
          return;
        }
        
        setCountryData(currentCountry);
        
        // Fetch history from backend (if present)
        if ((currentCountry as any).history) {
          setHistory((currentCountry as any).history);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch country data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      fetchData();
    }
  }, [countryName]);

  const aspects = Object.keys(aspectNameMap) as Array<keyof Scores>;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !countryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-500 dark:text-red-400">
              {error || 'Failed to load country data'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {countryData.country} Manufacturing Readiness
        </h1>
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full mr-3">
            Rank: #{countryData.rank}
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">
            Score: {countryData.totalScore.toFixed(1)}/10
          </div>
        </div>
        {('lastUpdated' in (countryData as any)) && (countryData as any).lastUpdated && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {typeof (countryData as any).lastUpdated === 'string' ? (countryData as any).lastUpdated.slice(0, 19).replace('T', ' ') : new Date((countryData as any).lastUpdated).toLocaleString()}
          </div>
        )}
        {('analysis' in (countryData as any)) && (countryData as any).analysis && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
            <div className="text-sm text-gray-700 dark:text-gray-200 font-semibold mb-1">Gemini Analysis</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sentiment: {(countryData as any).analysis.sentiment || 'N/A'}</div>
            <div className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">{(countryData as any).analysis.summary || (countryData as any).analysis}</div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ScoreBreakdown 
            scores={countryData.scores} 
            countryName={countryData.country} 
          />
        </div>
        <div className="lg:col-span-1">
          <NewsFeed 
            news={(countryData as any).news} 
            countryName={countryData.country} 
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Historical Trends
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedAspect(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedAspect === null
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650'
              }`}
            >
              Overall
            </button>
            {aspects.map(aspect => (
              <button
                key={aspect}
                onClick={() => setSelectedAspect(aspect)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedAspect === aspect
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650'
                }`}
              >
                {aspectNameMap[aspect]}
              </button>
            ))}
          </div>
        </div>
        <HistoricalChart 
          data={history} 
          aspect={selectedAspect || undefined} 
        />
      </div>
    </div>
  );
};

export default CountryDetail;