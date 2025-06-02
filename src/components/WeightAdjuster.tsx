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
    market: 20,
    workforce: 20,
    sustainability: 20
  });

  const [totalWeight, setTotalWeight] = useState(100);

  useEffect(() => {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    setTotalWeight(sum);
  }, [weights]);

  const handleWeightChange = (category: keyof UserWeights, value: number) => {
    // Clamp value to nearest 5
    value = Math.round(value / 5) * 5;
    let newWeights = { ...weights, [category]: value };
    let sum = Object.values(newWeights).reduce((a, b) => a + b, 0);

    if (sum !== 100) {
      // Distribute the difference among other categories
      const diff = 100 - value;
      const otherKeys = Object.keys(weights).filter(k => k !== category);
      let otherTotal = otherKeys.reduce((acc, k) => acc + weights[k as keyof UserWeights], 0);
      let adjusted = { ...newWeights };
      if (otherTotal === 0) {
        // If all others are zero, just set the changed one to 100
        adjusted = { ...weights, [category]: 100 };
      } else {
        otherKeys.forEach((k, i) => {
          // Proportionally distribute remaining weight
          let portion = Math.round((weights[k as keyof UserWeights] / otherTotal) * (100 - value) / 5) * 5;
          // On last key, fix rounding error
          if (i === otherKeys.length - 1) {
            portion = diff - Object.values(adjusted).reduce((a, b) => a + (k !== category ? b : 0), 0);
          }
          adjusted[k as keyof UserWeights] = Math.max(0, portion);
        });
        adjusted[category] = value;
      }
      newWeights = adjusted;
    }
    setWeights(newWeights);
    onWeightsChange(newWeights);
  };

  const categories = [
    { key: 'infrastructure', label: 'Infrastructure' },
    { key: 'regulatory', label: 'Regulatory' },
    { key: 'market', label: 'Market' },
    { key: 'workforce', label: 'Workforce' },
    { key: 'sustainability', label: 'Sustainability' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white tracking-tight">
        Assessment Weights
      </h2>
      <div className="space-y-6">
        {categories.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-4">
            <label className="w-48 text-base font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights[key as keyof UserWeights]}
              onChange={(e) => handleWeightChange(key as keyof UserWeights, parseInt(e.target.value))}
              className="flex-grow h-2 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              style={{ accentColor: '#2563EB' }}
            />
            <span className="w-12 text-base font-semibold text-gray-800 dark:text-gray-100 text-right">
              {weights[key as keyof UserWeights]}%
            </span>
          </div>
        ))}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Total:
          </span>
          <span className={`text-base font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}> 
            {totalWeight}%
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Adjust weights in 5% steps. Total always equals 100% (auto-balanced).
        </div>
      </div>
    </div>
  );
};

export default WeightAdjuster; 