import React from 'react';
import InputField from './InputField';
import ContinueBtn from './ContinueBtn';
import { useNavigation } from '../../../hooks/useNevigation';
import { useState } from 'react';

const IndividualForm = () => {
  const { completeOnboardingAndGoToDashboard } = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: ''
  });

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

console.log("Form Data:", formData); // ✅ DEBUGGING

  const handleSubmit = (e) => {
    e.preventDefault();
    completeOnboardingAndGoToDashboard(formData);
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Top Stepper */}

      {/* Header Section */}
      <header className="text-center mb-10 max-w-md">
        <h1 className="text-4xl font-serif text-[#1A2E2C] mb-4">Tell us about yourself</h1>
        <p className="text-sm text-gray-500 leading-relaxed px-4">
          Complete your clinician profile to customize your experience and begin curating patient data.
        </p>
      </header>

      {/* Form Card */}
      <div className="bg-white rounded-[3rem] shadow-sm w-full max-w-lg p-10 md:p-14">
        <form onSubmit={handleSubmit}>
          
          <InputField 
            label="Full Name"
            placeholder="Dr. Julian Thorne"
            helperText="As you'd like it to appear on clinical reports."
            onChange={handleChange}   // ✅ FIXED
            name="name"                 // ✅ ADD THIS
            value={formData.name}
            type='text'
            minLength={3}
            maxLength={50}
          />

          <InputField 
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            helperText="Used for secure two-factor authentication."
            type='number'
            onChange={handleChange}   // ✅ FIXED
            name="phone"                 // ✅ ADD THIS
            value={formData.phone}
            minLength={10}
            maxLength={10}
          />

          <InputField 
            label="Age (optional)"
            placeholder="32"
            helperText="Helps us tailor ergonomic UI settings for your demographic."
            type='number'
            onChange={handleChange}   // ✅ FIXED
            name="age"                 // ✅ ADD THIS
            value={formData.age}
            min={14}
            max={120}
          />

          {/* Submit Button */}
          <ContinueBtn />
          
        </form>
      </div>
    </div>
  );
};

export default IndividualForm;