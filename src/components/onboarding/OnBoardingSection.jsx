import React, { useState } from 'react';
import Stepper from './componant/Stepper';
import SlectionSection from './componant/SelectionSection';
import IndividualForm from './componant/IndividualForm';
import VendorForm from './componant/VendorForm';
// Import your step components here
// import StepOne from './StepOne'; 
// import StepTwo from './StepTwo';

function OnBoardingSection() {
  // 1. Manage current step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [IsClicked, setIsClicked] = useState(false);
  const [selectedType, setSelectedType] = useState('individual');
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
    };
const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
    };

  return (
    <div className="min-h-screen bg-[#F4F9F8] flex flex-col items-center justify-center p-4  relative overflow-hidden">
      
      {/* 2. Aesthetic Background Detail (The soft green blur) */}

      {/* 3. The Progress Indicator */}
      <div className="mb-2">
        <Stepper currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* 4. Main Content Area */}
      <main className="w-full max-w-4xl flex flex-col items-center animate-in fade-in zoom-in duration-500 mt-auto">
        {/* Conditionally render step components based on currentStep */}
        {(currentStep === 1 && <SlectionSection selectedType={selectedType} setSelectedType={setSelectedType}/>)}
        {(currentStep === 2 && selectedType === 'individual' && <IndividualForm />)}
        {(currentStep === 2 && selectedType === 'vendor' && <VendorForm />)}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep < totalSteps && (
            <button onClick={handleNext} className="px-6 py-3 bg-[#005D52] text-white rounded-full hover:bg-[#004D40] transition ">
              Continue
            </button>
          )}
          {currentStep > 1 && (
            <button onClick={handleBack} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition">
              Go Back
            </button>
          )}
        </div>

      </main>

      {/* 5. Fixed Branding or Support Footer (Optional) */}
      <footer className="mt-auto pt-2 text-gray-400 text-xs">
        &copy; 2026 Medilog Clinical Systems. All rights reserved.
      </footer>
    </div>
  );
}

export default OnBoardingSection;