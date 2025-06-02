import React from 'react';
import { Database, LineChart, Shield } from 'lucide-react';
import { ApiSource } from '../types';

interface FooterProps {
  apiSources: ApiSource[];
}

const Footer: React.FC<FooterProps> = ({ apiSources }) => {
  return (
    <footer className="bg-neutral-850 text-white mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-accent-500" /> 
              About This Tool
            </h4>
            <p className="text-sm text-gray-300">
              The Multi-criteria Risk Assessment Tool (MRAT) helps businesses evaluate African countries 
              for industrial expansion based on key factors: Infrastructure, Regulation, 
              Market Demand, Stability, and Partnerships.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-accent-500" /> 
              Data Sources
            </h4>
            <ul className="text-sm text-gray-300 space-y-2">
              {apiSources.slice(0, 5).map(source => (
                <li key={source.id}>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-accent-400 transition-colors"
                  >
                    {source.name} - {source.description}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-accent-500" /> 
              Methodology
            </h4>
            <p className="text-sm text-gray-300 mb-2">
              Scores are calculated from normalized inputs (1-10 scale) multiplied by factor weights.
              Data is refreshed every 24 hours from official sources.
            </p>
            <p className="text-sm text-gray-300">
              Traffic light system: 
              <span className="inline-flex items-center ml-1">
                <span className="traffic-light-green mr-1"></span>
                <span className="mr-2">Low Risk (7.5+)</span>
                <span className="traffic-light-amber mr-1"></span>
                <span className="mr-2">Medium Risk (6.0-7.4)</span>
                <span className="traffic-light-red mr-1"></span>
                <span>High Risk (&lt;6.0)</span>
              </span>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} African MRAT Dashboard. All rights reserved.</p>
          <p className="mt-1">Data updated daily. Last refresh: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;