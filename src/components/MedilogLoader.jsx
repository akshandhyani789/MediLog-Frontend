import React from 'react';

const MedilogLoader = ({}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0F766E]"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">
            Joining the community...
          </p>
        </div>
  );
};

export default MedilogLoader;