import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CountryData } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountryComparisonChartProps {
  countries: CountryData[];
  selectedCountry: CountryData | null;
  loading: boolean;
}

const CountryComparisonChart: React.FC<CountryComparisonChartProps> = ({
  countries,
  selectedCountry,
  loading
}) => {
  if (loading || !selectedCountry) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const factors = [
    'happiness',
    'education',
    'healthcare',
    'environment',
    'safety',
    'infrastructure',
    'innovation',
    'corruption'
  ];

  const data = {
    labels: factors.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
    datasets: [
      {
        label: selectedCountry.name,
        data: factors.map(f => selectedCountry[f as keyof CountryData] as number),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Average',
        data: factors.map(f => {
          const sum = countries.reduce((acc, country) => 
            acc + (country[f as keyof CountryData] as number), 0);
          return sum / countries.length;
        }),
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Country Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default CountryComparisonChart; 