import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HistoricalScore } from '../types';
import { format, parseISO } from 'date-fns';

interface HistoricalChartProps {
  data: HistoricalScore[];
  aspect?: keyof HistoricalScore['scores'];
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data, aspect }) => {
  // Sort data chronologically
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Map data for the chart
  const chartData = sortedData.map(item => ({
    date: typeof item.date === 'string' ? format(parseISO(item.date), 'MMM d') : format(item.date, 'MMM d'),
    score: aspect ? (typeof item.scores[aspect] === 'object' && item.scores[aspect] !== null && 'total' in item.scores[aspect] ? item.scores[aspect].total : item.scores[aspect]) : 0,
    tooltip: typeof item.date === 'string' ? format(parseISO(item.date), 'MMM d, yyyy') : format(item.date, 'MMM d, yyyy'),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white tracking-tight">
        Historical Trends
      </h2>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalChart;