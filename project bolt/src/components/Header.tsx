import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated, onRefresh, isRefreshing }) => {
  return (
    <header className="bg-neutral-850 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BarChart3 className="h-8 w-8 mr-3 text-accent-500" />
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">African MRAT Dashboard</h1>
              <p className="text-sm text-gray-300">Multi-criteria Risk Assessment Tool for Industrial Expansion</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-right mr-4">
              <div className="text-sm text-gray-300">Last updated</div>
              <div className="text-sm font-medium">
                {format(new Date(lastUpdated), 'MMM d, yyyy HH:mm')}
              </div>
            </div>
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn btn-primary flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;