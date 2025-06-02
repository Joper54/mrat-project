import React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Country, FactorWeight } from '../types';
import { getScoreColorClass, getRiskLevelInfo, formatScore } from '../utils/scoreCalculator';

interface CountriesTableProps {
  countries: Country[];
  factorWeights: FactorWeight[];
  selectedCountryIds: string[];
  onCountryToggle: (countryId: string) => void;
}

const CountriesTable: React.FC<CountriesTableProps> = ({ 
  countries, 
  factorWeights,
  selectedCountryIds,
  onCountryToggle
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compare
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Country
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Score
            </th>
            {factorWeights.map((factor) => (
              <th 
                key={factor.factor} 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                title={factor.description}
              >
                {factor.displayName} ({(factor.weight * 100).toFixed(0)}%)
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Level
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {countries.map((country, index) => {
            const riskInfo = getRiskLevelInfo(country.riskLevel || 'medium');
            
            return (
              <tr key={country.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => onCountryToggle(country.id)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      selectedCountryIds.includes(country.id) 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {selectedCountryIds.includes(country.id) ? (
                      <Check className="w-4 h-4" />
                    ) : null}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={country.flagUrl} 
                      alt={`${country.name} flag`}
                      className="w-6 h-4 mr-2 border border-gray-200"
                    />
                    <span className="font-medium">{country.name}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getScoreColorClass(country.totalScore || 0)}`}>
                  <span className="font-bold">{country.totalScore?.toFixed(1)}</span>
                </td>
                {factorWeights.map((factor) => (
                  <td 
                    key={`${country.id}-${factor.factor}`} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {formatScore(country.scores[factor.factor])}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`${riskInfo.class} mr-2`}></div>
                    <span className={`text-sm ${riskInfo.textClass}`}>{riskInfo.label}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CountriesTable;