import React, { useState, useEffect } from 'react';
import { UserWeights } from '../types';
import { fetchAllScores } from '../services/api';

interface WeightAdjusterProps {
  onWeightsChange: (weights: UserWeights) => void;
}

const WeightAdjuster: React.FC<WeightAdjusterProps> = ({ onWeightsChange }) => {
  const [weights, setWeights] = useState<UserWeights>({
    infrastructure: 20,
    regulatory: 20,
    market_demand: 20,
    stability: 20,
    partnership: 20
  });

  const [totalWeight, setTotalWeight] = useState(100);

  useEffect(() => {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    setTotalWeight(sum);
  }, [weights]);

  const handleWeightChange = (category: keyof UserWeights, value: number) => {
    const newWeights = { ...weights, [category]: value };
    setWeights(newWeights);
    onWeightsChange(newWeights);
  };

  const categories = [
    { key: 'infrastructure', label: 'Infrastructure' },
    { key: 'regulatory', label: 'Regulatory' },
    { key: 'market_demand', label: 'Market Demand' },
    { key: 'stability', label: 'Stability' },
    { key: 'partnership', label: 'Partnership' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Adjust Factor Weights
      </h2>
      <div className="space-y-4">
        {categories.map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-4">
            <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={weights[key as keyof UserWeights]}
              onChange={(e) => handleWeightChange(key as keyof UserWeights, parseInt(e.target.value))}
              className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="w-12 text-sm text-gray-600 dark:text-gray-400">
              {weights[key as keyof UserWeights]}%
            </span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Weight
            </span>
            <span className={`text-sm font-medium ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight}%
            </span>
          </div>
          {totalWeight !== 100 && (
            <p className="mt-2 text-sm text-red-600">
              Total weight must equal 100%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightAdjuster; 