import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Country } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountryComparisonChartProps {
  countries: Country[];
}

const CountryComparisonChart: React.FC<CountryComparisonChartProps> = ({ countries }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Score (1-10)'
        }
      }
    }
  };
  
  const getColorForIndex = (index: number) => {
    const colors = [
      'rgba(15, 82, 186, 0.8)', // primary
      'rgba(10, 135, 84, 0.8)', // secondary
      'rgba(255, 199, 44, 0.8)', // accent
      'rgba(255, 165, 0, 0.8)', // warning
      'rgba(210, 43, 43, 0.8)', // danger
      'rgba(107, 114, 128, 0.8)' // gray
    ];
    
    return colors[index % colors.length];
  };
  
  const getHoverColorForIndex = (index: number) => {
    const colors = [
      'rgba(15, 82, 186, 1)', // primary
      'rgba(10, 135, 84, 1)', // secondary
      'rgba(255, 199, 44, 1)', // accent
      'rgba(255, 165, 0, 1)', // warning
      'rgba(210, 43, 43, 1)', // danger
      'rgba(107, 114, 128, 1)' // gray
    ];
    
    return colors[index % colors.length];
  };
  
  const labels = ['Total Score'];
  
  const datasets = countries.map((country, index) => ({
    label: country.name,
    data: [country.totalScore],
    backgroundColor: getColorForIndex(index),
    hoverBackgroundColor: getHoverColorForIndex(index),
    borderColor: getHoverColorForIndex(index),
    borderWidth: 1
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
    <div className="chart-container">
      <Bar options={options} data={data} />
    </div>
  );
};

export default CountryComparisonChart;