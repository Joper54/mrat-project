import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Scores } from '../types';
import { aspectNameMap } from '../utils/formatters';

interface ScoreBreakdownProps {
  scores: Scores;
  countryName: string;
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores, countryName }) => {
  const data = Object.entries(scores).map(([key, value]) => ({
    aspect: aspectNameMap[key] || key,
    score: value,
    fill: getColorForScore(value),
  }));

  function getColorForScore(score: number): string {
    if (score >= 9) return '#10B981'; // emerald-500
    if (score >= 7) return '#22C55E'; // green-500
    if (score >= 5) return '#EAB308'; // yellow-500
    if (score >= 3) return '#F97316'; // orange-500
    return '#EF4444'; // red-500
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {countryName} Score Breakdown
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 10]} 
              tickCount={6} 
              className="text-xs"
            />
            <YAxis 
              type="category" 
              dataKey="aspect" 
              className="text-xs"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [`${value}/10`, 'Score']}
            />
            <Bar 
              dataKey="score" 
              radius={[0, 4, 4, 0]} 
              barSize={24}
              fill="#2563EB"
              fillOpacity={0.85}
              animationDuration={1000}
              isAnimationActive={true}
              name="Score"
            />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreBreakdown;