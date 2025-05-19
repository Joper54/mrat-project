import React from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { CountryScore } from '../types';
import { aspectNameMap } from '../utils/formatters';

interface CountryComparisonProps {
  countries: CountryScore[];
  selectedCountries: string[];
}

const CountryComparison: React.FC<CountryComparisonProps> = ({ 
  countries, 
  selectedCountries 
}) => {
  const filteredCountries = countries.filter(
    country => selectedCountries.includes(country.country)
  );

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];

  const aspects = Object.keys(aspectNameMap);
  
  const data = aspects.map(aspect => {
    const dataPoint: Record<string, any> = {
      aspect: aspectNameMap[aspect],
    };
    
    filteredCountries.forEach((country, index) => {
      dataPoint[country.country] = country.scores[aspect as keyof typeof country.scores];
    });
    
    return dataPoint;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors h-96">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Country Comparison
      </h3>
      {filteredCountries.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <RadarChart 
            outerRadius="70%" 
            data={data}
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          >
            <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="aspect" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 10]} 
              tick={{ fill: '#64748b', fontSize: 10 }} 
            />
            {filteredCountries.map((country, index) => (
              <Radar
                key={country.country}
                name={country.country}
                dataKey={country.country}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.2}
                animationDuration={500}
                animationEasing="ease-out"
              />
            ))}
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [`${value}/10`, 'Score']}
            />
            <Legend 
              align="center" 
              verticalAlign="bottom" 
              layout="horizontal" 
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Select countries to compare
          </p>
        </div>
      )}
    </div>
  );
};

export default CountryComparison;