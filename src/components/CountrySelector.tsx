import React, { useState } from 'react';
import { CountryScore } from '../types';
import { Check, ChevronDown } from 'lucide-react';

interface CountrySelectorProps {
  countries: CountryScore[];
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
  maxSelection?: number;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountries,
  onChange,
  maxSelection = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      onChange(selectedCountries.filter(c => c !== country));
    } else if (selectedCountries.length < maxSelection) {
      onChange([...selectedCountries, country]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none transition-colors"
      >
        <span>
          {selectedCountries.length === 0
            ? 'Select countries to compare'
            : `${selectedCountries.length} country/countries selected`}
        </span>
        <ChevronDown size={16} className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto transition-colors">
          <div className="py-1">
            {countries.map((country) => (
              <button
                key={country._id}
                onClick={() => toggleCountry(country.country)}
                disabled={!selectedCountries.includes(country.country) && selectedCountries.length >= maxSelection}
                className={`
                  flex items-center justify-between w-full px-4 py-2 text-sm
                  ${selectedCountries.includes(country.country)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'}
                  ${!selectedCountries.includes(country.country) && selectedCountries.length >= maxSelection
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'}
                `}
              >
                <span>{country.country}</span>
                {selectedCountries.includes(country.country) && (
                  <Check size={16} className="text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            Select up to {maxSelection} countries to compare
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;