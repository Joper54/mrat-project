import React, { useState, useEffect } from 'react';
import { Country, Scores } from '../types';
import { fetchAllScores, updateCountryScores } from '../services/api';

const ADMIN_PASSWORD = 'admin123'; // TODO: Replace with env or real auth

const defaultScores: Scores = {
  infrastructure: 5,
  regulatory: 5,
  market: 5,
  workforce: 5,
  sustainability: 5,
};

// Helper to get numeric value from ScoreValue
const getScoreNumber = (v: any) => typeof v === 'number' ? v : (v && typeof v.total === 'number' ? v.total : 0);

const AdminPanel: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'manual' | 'spreadsheet'>('manual');
  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState({ name: '', ...defaultScores });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authed) {
      fetchCountries();
    }
  }, [authed]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const data = await fetchAllScores();
      setCountries(data.map(c => ({ name: c.country, scores: c.scores, news: [], history: [], lastUpdated: new Date() })));
    } catch (e) {
      setError('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'name' ? value : Math.max(1, Math.min(10, Number(value))) }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { name, ...scores } = form;
      // Normalize scores to 1-10 and ensure numbers
      const normScores: Scores = Object.fromEntries(
        Object.entries(scores).map(([k, v]) => [k, Math.max(1, Math.min(10, getScoreNumber(v)))])
      ) as unknown as Scores;
      await updateCountryScores(name, normScores);
      setSuccess('Country data updated!');
      fetchCountries();
    } catch (e) {
      setError('Failed to update country');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const text = await file.text();
      // Assume CSV: name,infrastructure,regulatory,market,workforce,sustainability
      const lines = text.split(/\r?\n/).filter(Boolean);
      for (let i = 1; i < lines.length; i++) {
        const [name, infrastructure, regulatory, market, workforce, sustainability] = lines[i].split(',');
        const normScores: Scores = {
          infrastructure: Math.max(1, Math.min(10, getScoreNumber(infrastructure))),
          regulatory: Math.max(1, Math.min(10, getScoreNumber(regulatory))),
          market: Math.max(1, Math.min(10, getScoreNumber(market))),
          workforce: Math.max(1, Math.min(10, getScoreNumber(workforce))),
          sustainability: Math.max(1, Math.min(10, getScoreNumber(sustainability))),
        };
        await updateCountryScores(name, normScores);
      }
      setSuccess('Spreadsheet uploaded!');
      fetchCountries();
    } catch (e) {
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
            onClick={() => setAuthed(password === ADMIN_PASSWORD)}
          >
            Login
          </button>
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${tab === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setTab('manual')}
            >Manual Entry</button>
            <button
              className={`px-4 py-2 rounded ${tab === 'spreadsheet' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setTab('spreadsheet')}
            >Spreadsheet Upload</button>
          </div>
          {tab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Country Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              {Object.keys(defaultScores).map(key => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type="number"
                    name={key}
                    min={1}
                    max={10}
                    step={0.1}
                    value={getScoreNumber(form[key as keyof Scores])}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                disabled={loading}
              >{loading ? 'Saving...' : 'Save Country'}</button>
              {success && <div className="text-green-600 mt-2 text-sm">{success}</div>}
              {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
            </form>
          )}
          {tab === 'spreadsheet' && (
            <div>
              <label className="block text-sm font-medium mb-2">Upload CSV (name,infrastructure,regulatory,market,workforce,sustainability)</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mb-4"
              />
              {success && <div className="text-green-600 mt-2 text-sm">{success}</div>}
              {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Current Country Data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1">Country</th>
                  <th className="px-2 py-1">Infrastructure</th>
                  <th className="px-2 py-1">Regulatory</th>
                  <th className="px-2 py-1">Market</th>
                  <th className="px-2 py-1">Workforce</th>
                  <th className="px-2 py-1">Sustainability</th>
                </tr>
              </thead>
              <tbody>
                {countries.map(c => (
                  <tr key={c.name}>
                    <td className="px-2 py-1 font-semibold">{c.name}</td>
                    <td className="px-2 py-1">{getScoreNumber(c.scores.infrastructure)}</td>
                    <td className="px-2 py-1">{getScoreNumber(c.scores.regulatory)}</td>
                    <td className="px-2 py-1">{getScoreNumber(c.scores.market)}</td>
                    <td className="px-2 py-1">{getScoreNumber(c.scores.workforce)}</td>
                    <td className="px-2 py-1">{getScoreNumber(c.scores.sustainability)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 