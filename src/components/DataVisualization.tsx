import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { VisualizationResponseSchema } from '../../server/src/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface DataVisualizationProps {
  data: any;
  loading: boolean;
  error: string | null;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, loading, error }) => {
  const [timeRange, setTimeRange] = useState<string>('');

  if (loading) return <div>Loading visualization...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const renderChart = () => {
    const { visualization_type, x_axis, y_axis, data: chartData } = data;

    switch (visualization_type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={x_axis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={y_axis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={x_axis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={y_axis} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={x_axis} />
              <YAxis dataKey={y_axis} />
              <Tooltip />
              <Legend />
              <Scatter data={chartData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={y_axis}
                nameKey={x_axis}
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported visualization type</div>;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{data.title}</h2>
      <p className="mb-4">{data.description}</p>
      
      {data.historicalData && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Time Range
          </label>
          <input
            type="text"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            placeholder="YYYY-MM-DD,YYYY-MM-DD"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        {renderChart()}
      </div>

      {data.insights && data.insights.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Insights</h3>
          <ul className="list-disc pl-5">
            {data.insights.map((insight: string, index: number) => (
              <li key={index} className="text-gray-700">{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataVisualization; 