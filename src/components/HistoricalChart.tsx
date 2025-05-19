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
    date: format(parseISO(item.date), 'MMM d'),
    value: aspect ? item.scores[aspect] : item.total_score,
    tooltip: format(parseISO(item.date), 'MMM d, yyyy'),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {aspect ? `${aspect.charAt(0).toUpperCase() + aspect.slice(1)} Score History` : 'Overall Score History'}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 10]} 
              tickCount={6} 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              labelFormatter={(_, data) => data[0]?.payload?.tooltip || ''}
              formatter={(value) => [`${value}/10`, aspect ? aspect : 'Overall Score']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              animationDuration={1000}
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalChart;