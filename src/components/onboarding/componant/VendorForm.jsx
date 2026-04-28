import ContinueBtn from "./ContinueBtn";
import InputField from "./InputField";
import { useNavigation } from '../../../hooks/useNevigation';
import { useState } from "react";

const VendorForm = () => {
  const { goToDashboard } = useNavigation();
  

    let [formData, setFormData] = useState({
      role: 'vendor',
      businessName: '',
      ownerName: '',
      businessPhone: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    const { completeOnboardingAndGoToDashboard } = useNavigation();
      const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
          role: 'vendor',
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          businessPhone: formData.businessPhone,
        };
        completeOnboardingAndGoToDashboard(data);
      };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <header className="text-center mb-10 max-w-md">
        <h1 className="text-4xl font-serif text-[#1A2E2C] mb-4">Vendor Details</h1>
        <p className="text-sm text-gray-500 leading-relaxed px-4">
          Register your organization to manage supply chains and regulatory documentation.
        </p>
      </header>

      {/* Form Card */}
      <div className="bg-white rounded-[3rem] shadow-sm w-full max-w-lg p-10 md:p-14 border border-gray-100">
        <form onSubmit={handleSubmit}>
          
          <InputField 
            label="Business Name"
            placeholder="e.g. Nexus Pharma Solutions"
            helperText="The legal name of your registered entity."
            name="businessName"
            type='text'
            onChange={handleChange}
              value={formData.businessName}
             minLength={3}
            maxLength={100}
          />

          <InputField 
            label="Owner Name"
            placeholder="Dr. Julian Thorne"
            helperText="The primary contact or authorized signatory for this account."
            name="ownerName"
            type='text'
            onChange={handleChange}
              value={formData.ownerName}
            minLength={3}
            maxLength={50}
          />

          <InputField 
            label="Business Phone Number"
            placeholder="+1 (555) 000-0000"
            helperText="Used for order notifications and secure authentication."
            type='number'
            name="businessPhone"
            onChange={handleChange}
              value={formData.businessPhone}
            minLength={10}
            maxLength={10}
          />

          {/* Note: Age field removed as requested */}

          <ContinueBtn />
          
        </form>
      </div>
    </div>
  );
};

export default VendorForm;