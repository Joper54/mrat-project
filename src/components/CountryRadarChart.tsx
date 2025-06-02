import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { CountryData } from '../services/api';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CountryRadarChartProps {
  country: CountryData | null;
  loading: boolean;
}

const CountryRadarChart: React.FC<CountryRadarChartProps> = ({
  country,
  loading
}) => {
  if (loading || !country) {
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
        label: country.name,
        data: factors.map(f => country[f as keyof CountryData] as number),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
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
        text: 'Country Performance Radar',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Radar data={data} options={options} />
    </div>
  );
};

export default CountryRadarChart; 