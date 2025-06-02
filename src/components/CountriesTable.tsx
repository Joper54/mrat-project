import React from 'react';
import { CountryData } from '../services/api';

interface CountriesTableProps {
  countries: CountryData[];
  onCountrySelect: (code: string) => void;
  loading: boolean;
}

const CountriesTable: React.FC<CountriesTableProps> = ({
  countries,
  onCountrySelect,
  loading
}) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Countries</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select a country to view detailed analysis
        </p>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GDP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Population
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {countries.map((country) => (
              <tr
                key={country.code}
                onClick={() => onCountrySelect(country.code)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {country.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    ${(country.gdp / 1e9).toFixed(2)}B
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {(country.population / 1e6).toFixed(2)}M
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountriesTable; 