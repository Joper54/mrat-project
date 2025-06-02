import React, { useState } from 'react';

interface VisualizationFormProps {
  onSubmit: (data: {
    question: string;
    visualization_type: 'bar' | 'line' | 'scatter' | 'pie';
    x_axis: string;
    y_axis: string;
    filters?: Record<string, string>;
  }) => void;
  loading: boolean;
}

const VisualizationForm: React.FC<VisualizationFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    question: '',
    visualization_type: 'bar' as const,
    x_axis: 'country',
    y_axis: 'gdp',
    time_range: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { time_range, ...rest } = formData;
    onSubmit({
      ...rest,
      filters: time_range ? { time_range } : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question
        </label>
        <input
          type="text"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="What would you like to analyze?"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Visualization Type
        </label>
        <select
          value={formData.visualization_type}
          onChange={(e) => setFormData({ ...formData, visualization_type: e.target.value as any })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="scatter">Scatter Plot</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          X-Axis
        </label>
        <select
          value={formData.x_axis}
          onChange={(e) => setFormData({ ...formData, x_axis: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="country">Country</option>
          <option value="gdp">GDP</option>
          <option value="population">Population</option>
          <option value="unemployment">Unemployment</option>
          <option value="school_enrollment">School Enrollment</option>
          <option value="life_expectancy">Life Expectancy</option>
          <option value="electricity_access">Electricity Access</option>
          <option value="co2_emissions">CO₂ Emissions</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Y-Axis
        </label>
        <select
          value={formData.y_axis}
          onChange={(e) => setFormData({ ...formData, y_axis: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="gdp">GDP</option>
          <option value="population">Population</option>
          <option value="unemployment">Unemployment</option>
          <option value="school_enrollment">School Enrollment</option>
          <option value="life_expectancy">Life Expectancy</option>
          <option value="electricity_access">Electricity Access</option>
          <option value="co2_emissions">CO₂ Emissions</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time Range (Optional)
        </label>
        <input
          type="text"
          value={formData.time_range}
          onChange={(e) => setFormData({ ...formData, time_range: e.target.value })}
          placeholder="YYYY-MM-DD,YYYY-MM-DD"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Visualization'}
      </button>
    </form>
  );
};

export default VisualizationForm; 