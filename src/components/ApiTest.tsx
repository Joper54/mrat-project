import React, { useEffect, useState } from 'react';
import { fetchCountryData } from '../services/aimlApi';

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    data?: any;
  }>({
    status: 'idle',
    message: ''
  });

  const runTest = async () => {
    try {
      setTestResult({ status: 'loading', message: 'Testing API connection...' });
      const data = await fetchCountryData('Nigeria');
      setTestResult({
        status: 'success',
        message: 'API connection successful',
        data
      });
    } catch (error) {
      setTestResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-semibold mb-2">API Connection Test</h3>
      <div className="space-y-2">
        <p className="flex items-center">
          <span className="font-medium mr-2">Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            testResult.status === 'success' ? 'bg-green-100 text-green-800' :
            testResult.status === 'error' ? 'bg-red-100 text-red-800' :
            testResult.status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {testResult.status}
          </span>
        </p>
        <p><span className="font-medium">Message:</span> {testResult.message}</p>
        {testResult.data && (
          <div className="mt-2">
            <p className="font-medium">Response Data:</p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-auto max-h-40">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </div>
        )}
        <button
          onClick={runTest}
          disabled={testResult.status === 'loading'}
          className={`mt-2 px-4 py-2 rounded ${
            testResult.status === 'loading'
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {testResult.status === 'loading' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
};

export default ApiTest; 