import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} Country Analysis Dashboard. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Data provided by various international organizations and news sources.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 