import React, { useState } from 'react';
import SelectionCard from './SelectionCard';

const SlectionSection = ({selectedType, setSelectedType}) => {

  return (
    <div className="bg-[#F4F9F8] flex flex-col items-center justify-center mt-4 font-sans">
      {/* Background Gradient Blur */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#B2DFDB] blur-[120px] opacity-30 rounded-full -z-10" />

      {/* Header Section */}
      <header className="text-center mb-16 max-w-2xl">
        <h1 className="text-5xl font-serif text-[#1A2E2C] mb-6">Welcome to Medilog</h1>
        <p className="text-lg text-gray-600 font-light">
          How would you like to get started? Select a journey to personalize your MediLog experience.
        </p>
      </header>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-8 mb-16 w-full justify-center items-center">
        <SelectionCard 
          title="Individual User"
          description="Manage your personal medications, health logs, and clinical history in a secure, serene environment."
          isSelected={selectedType === 'individual'}
          onClick={() => setSelectedType('individual')}
          icon={
            <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          }
        />

        <SelectionCard 
          title="Pharmaceutical Vendor"
          description="Access the curator portal to manage supply chains, regulatory documentation, and institutional logs."
          isSelected={selectedType === 'vendor'}
          onClick={() => setSelectedType('vendor')}
          icon={
            <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
            </svg>
          }
        />
      </div>

      
    </div>
  );
};

export default SlectionSection;