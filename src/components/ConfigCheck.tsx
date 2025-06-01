import React, { useEffect, useState } from 'react';

const ConfigCheck: React.FC = () => {
  const [config, setConfig] = useState<{
    apiKey: string;
    apiUrl: string;
    nodeEnv: string;
    baseUrl: string;
  }>({
    apiKey: '',
    apiUrl: '',
    nodeEnv: '',
    baseUrl: ''
  });

  useEffect(() => {
    setConfig({
      apiKey: import.meta.env.VITE_AIML_API_KEY ? 'Present' : 'Missing',
      apiUrl: import.meta.env.VITE_AIML_API_URL || 'Not set',
      nodeEnv: import.meta.env.MODE,
      baseUrl: window.location.origin
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-semibold mb-2">Configuration Check</h3>
      <div className="space-y-2">
        <p><span className="font-medium">API Key:</span> {config.apiKey}</p>
        <p><span className="font-medium">API URL:</span> {config.apiUrl}</p>
        <p><span className="font-medium">Environment:</span> {config.nodeEnv}</p>
        <p><span className="font-medium">Base URL:</span> {config.baseUrl}</p>
      </div>
    </div>
  );
};

export default ConfigCheck; 