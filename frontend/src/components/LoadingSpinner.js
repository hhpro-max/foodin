import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };
  
  // Container classes
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50'
    : 'flex items-center justify-center p-4';
  
  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner; 