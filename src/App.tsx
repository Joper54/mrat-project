import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CountryDetail from './pages/CountryDetail';
import NewsPage from './pages/NewsPage';
import CountryList from './pages/CountryList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/countries" element={<CountryList />} />
            <Route path="/country/:countryName" element={<CountryDetail />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Manufacturing Readiness Assessment Tool © {new Date().getFullYear()} | 
              Data refreshed daily with World Bank indicators and DeepSeek news analysis
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;