import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CountryScore } from '../types';

const FACTORS = [
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'regulatory', label: 'Regulatory' },
  { key: 'market', label: 'Market' },
  { key: 'workforce', label: 'Workforce' },
  { key: 'sustainability', label: 'Sustainability' },
];

function getScoreValue(score: any) {
  return typeof score === 'object' && score !== null && 'total' in score
    ? score.total
    : typeof score === 'number'
    ? score
    : 0;
}

function getBarColor(score: number) {
  if (score >= 7) return '#22C55E'; // green
  if (score >= 5) return '#EAB308'; // yellow
  return '#EF4444'; // red
}

// Custom shape for colored bars
const ColoredBar = (factorKey: string) => (props: any) => {
  const { x, y, width, height, payload } = props;
  const value = payload[factorKey];
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={getBarColor(value)}
      rx={4}
    />
  );
};

const FactorBarGraph: React.FC<{ countries: CountryScore[] }> = ({ countries }) => {
  // Prepare data: one entry per country, each factor as a value
  const data = countries.map(country => {
    const entry: any = { name: country.country };
    FACTORS.forEach(factor => {
      entry[factor.key] = getScoreValue(country.scores[factor.key as keyof typeof country.scores]);
    });
    return entry;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Factor Comparison Across Countries</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tickCount={6} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: any) => [`${value}/10`, 'Score']} />
            <Legend />
            {FACTORS.map(factor => (
              <Bar
                key={factor.key}
                dataKey={factor.key}
                name={factor.label}
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={800}
                fillOpacity={0.85}
                shape={ColoredBar(factor.key)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FactorBarGraph; 