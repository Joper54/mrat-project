import React, { useState } from 'react';
import { FactorWeight } from '../types';
import { InfoIcon } from 'lucide-react';

interface FactorWeightEditorProps {
  weights: FactorWeight[];
  onUpdateWeights: (weights: FactorWeight[]) => void;
}

const FactorWeightEditor: React.FC<FactorWeightEditorProps> = ({ 
  weights, 
  onUpdateWeights
}) => {
  const [localWeights, setLocalWeights] = useState<FactorWeight[]>(weights);
  const [error, setError] = useState<string | null>(null);
  
  const handleWeightChange = (factor: string, newValue: number) => {
    const updatedWeights = localWeights.map(weight => {
      if (weight.factor === factor) {
        return { ...weight, weight: newValue };
      }
      return weight;
    });
    
    setLocalWeights(updatedWeights);
    
    // Validate total = 1
    const total = updatedWeights.reduce((sum, w) => sum + w.weight, 0);
    if (Math.abs(total - 1) > 0.01) {
      setError(`Weights must sum to 100% (currently ${(total * 100).toFixed(0)}%)`);
    } else {
      setError(null);
    }
  };
  
  const handleApplyWeights = () => {
    if (!error) {
      onUpdateWeights(localWeights);
    }
  };
  
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Adjust the importance of each factor in the overall country assessment.
      </p>
      
      {error && (
        <div className="bg-danger-50 text-danger-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {localWeights.map((weight) => (
          <div key={weight.factor} className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm font-medium">
                {weight.displayName}
                <button
                  type="button"
                  className="ml-1 text-gray-400 hover:text-gray-500"
                  title={weight.description}
                >
                  <InfoIcon className="h-3.5 w-3.5" />
                </button>
              </label>
              <span className="text-sm font-medium">
                {(weight.weight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={weight.weight}
              onChange={(e) => handleWeightChange(weight.factor, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleApplyWeights}
          disabled={!!error}
          className={`w-full btn ${error ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'}`}
        >
          Apply Weights
        </button>
      </div>
    </div>
  );
};

export default FactorWeightEditor;