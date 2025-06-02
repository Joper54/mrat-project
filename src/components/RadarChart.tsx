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

const getScoreValue = (score: any) =>
  typeof score === 'object' && score !== null && 'total' in score
    ? score.total
    : typeof score === 'number'
    ? score
    : 0;

const RadarChart: React.FC<RadarChartProps> = ({ scores, country }) => {
  const data = [
    {
      category: 'Infrastructure',
      score: getScoreValue(scores.infrastructure),
      fullMark: 10
    },
    {
      category: 'Regulatory',
      score: getScoreValue(scores.regulatory),
      fullMark: 10
    },
    {
      category: 'Market',
      score: getScoreValue(scores.market),
      fullMark: 10
    },
    {
      category: 'Workforce',
      score: getScoreValue(scores.workforce),
      fullMark: 10
    },
    {
      category: 'Sustainability',
      score: getScoreValue(scores.sustainability),
      fullMark: 10
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white tracking-tight">
        {country} - Factor Scores
      </h2>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
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