import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Country } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CountryRadarChartProps {
  countries: Country[];
}

const CountryRadarChart: React.FC<CountryRadarChartProps> = ({ countries }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        beginAtZero: true,
        ticks: {
          stepSize: 2
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };
  
  const getColorForIndex = (index: number, alpha: number = 0.2) => {
    const colors = [
      `rgba(15, 82, 186, ${alpha})`, // primary
      `rgba(10, 135, 84, ${alpha})`, // secondary
      `rgba(255, 199, 44, ${alpha})`, // accent
      `rgba(255, 165, 0, ${alpha})`, // warning
      `rgba(210, 43, 43, ${alpha})`, // danger
      `rgba(107, 114, 128, ${alpha})` // gray
    ];
    
    return colors[index % colors.length];
  };
  
  const labels = [
    'Infrastructure',
    'Regulation',
    'Market Demand',
    'Stability',
    'Partnerships'
  ];
  
  const datasets = countries.map((country, index) => ({
    label: country.name,
    data: [
      country.scores.infrastructure,
      country.scores.regulation,
      country.scores.marketDemand,
      country.scores.stability,
      country.scores.partnerships
    ],
    backgroundColor: getColorForIndex(index),
    borderColor: getColorForIndex(index, 1),
    borderWidth: 1,
    pointBackgroundColor: getColorForIndex(index, 1),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: getColorForIndex(index, 1)
  }));
  
  const data = {
    labels,
    datasets
  };

  if (countries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select countries to compare</p>
      </div>
    );
  }

  return (
    <div className="radar-chart-container">
      <Radar options={options} data={data} />
    </div>
  );
};

export default CountryRadarChart;