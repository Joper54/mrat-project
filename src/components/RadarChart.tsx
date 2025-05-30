import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { Scores } from '../types';

interface RadarChartProps {
  scores: Scores;
  country: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ scores, country }) => {
  const data = [
    {
      category: 'Infrastructure',
      score: scores.infrastructure.total,
      fullMark: 10
    },
    {
      category: 'Regulatory',
      score: scores.regulatory.total,
      fullMark: 10
    },
    {
      category: 'Market Demand',
      score: scores.market_demand.total,
      fullMark: 10
    },
    {
      category: 'Stability',
      score: scores.stability.total,
      fullMark: 10
    },
    {
      category: 'Partnership',
      score: scores.partnership.total,
      fullMark: 10
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        {country} Performance Radar
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar
              name={country}
              dataKey="score"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChart; 