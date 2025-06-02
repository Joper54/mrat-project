import React, { ReactNode } from 'react';

interface DashboardProps {
  children: ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {children}
    </div>
  );
};

export default Dashboard; 