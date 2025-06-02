import React, { useState } from 'react';

interface FactorWeightEditorProps {
  onWeightsChange?: (weights: Record<string, number>) => void;
}

const FactorWeightEditor: React.FC<FactorWeightEditorProps> = ({
  onWeightsChange
}) => {
  const [weights, setWeights] = useState({
    happiness: 1,
    education: 1,
    healthcare: 1,
    environment: 1,
    safety: 1,
    infrastructure: 1,
    innovation: 1,
    corruption: 1
  });

  const handleWeightChange = (factor: string, value: number) => {
    const newWeights = {
      ...weights,
      [factor]: value
    };
    setWeights(newWeights);
    onWeightsChange?.(newWeights);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Factor Weights
      </h3>
      <div className="space-y-4">
        {Object.entries(weights).map(([factor, weight]) => (
          <div key={factor} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 capitalize">
              {factor}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={weight}
              onChange={(e) => handleWeightChange(factor, parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-500 w-12 text-right">
              {weight.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactorWeightEditor; 