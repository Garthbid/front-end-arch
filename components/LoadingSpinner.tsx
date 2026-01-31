import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2238ff]" />
  </div>
);
export default LoadingSpinner;
