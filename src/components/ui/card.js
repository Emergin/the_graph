import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`border-b pb-2 mb-4 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ title, className = '' }) => {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>{title}</h2>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };
