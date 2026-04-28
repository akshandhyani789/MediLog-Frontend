import React from 'react';

const Stepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-4">
        {[...Array(totalSteps)].map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${
              i < currentStep ? 'bg-[#00695C]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold tracking-[0.2em] text-[#00695C] uppercase">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
};

export default Stepper;