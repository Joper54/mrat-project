import React, { useState } from 'react';
import VisualizationForm from '../components/VisualizationForm';
import DataVisualization from '../components/DataVisualization';

const VisualizationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizationData, setVisualizationData] = useState<any>(null);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/gemini/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate visualization');
      }

      const data = await response.json();
      setVisualizationData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Data Visualization Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Configure Visualization</h2>
          <VisualizationForm onSubmit={handleSubmit} loading={loading} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <DataVisualization
            data={visualizationData}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage; 