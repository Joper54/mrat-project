import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Country Analysis Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Compare countries and analyze their performance across various factors
        </p>
      </div>
    </header>
  );
};

export default Header;