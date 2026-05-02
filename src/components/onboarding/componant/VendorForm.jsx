import ContinueBtn from "./ContinueBtn";
import InputField from "./InputField";
import { useNavigation } from "../../../hooks/useNevigation";
import { useState } from "react";

const VendorForm = () => {
  const { completeOnboardingAndGoToDashboard } = useNavigation();

  const [formData, setFormData] = useState({
    role: "vendor",
    businessName: "",
    ownerName: "",
    businessPhone: "",
  });

  const [phoneError, setPhoneError] = useState("");

  // ✅ Phone validation (India)
  const isValidPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Handle phone field separately
    if (name === "businessPhone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        businessPhone: onlyDigits,
      }));

      if (onlyDigits.length === 10 && !isValidPhone(onlyDigits)) {
        setPhoneError("Enter a valid 10-digit Indian mobile number.");
      } else {
        setPhoneError("");
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Final validation before submit
    if (!isValidPhone(formData.businessPhone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    completeOnboardingAndGoToDashboard(formData);
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <header className="text-center mb-10 max-w-md">
        <h1 className="text-4xl font-serif text-[#1A2E2C] mb-4">
          Vendor Details
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed px-4">
          Register your organization to manage supply chains and regulatory documentation.
        </p>
      </header>

      {/* Form */}
      <div className="bg-white rounded-[3rem] shadow-sm w-full max-w-lg p-10 md:p-14 border border-gray-100">
        <form onSubmit={handleSubmit}>
          
          <InputField
            label="Business Name"
            placeholder="Nexus Pharma Solutions"
            helperText="The legal name of your registered entity."
            name="businessName"
            type="text"
            onChange={handleChange}
            value={formData.businessName}
            minLength={3}
            maxLength={100}
          />

          <InputField
            label="Owner Name"
            placeholder="Dr. Julian Thorne"
            helperText="Authorized signatory for this account."
            name="ownerName"
            type="text"
            onChange={handleChange}
            value={formData.ownerName}
            minLength={3}
            maxLength={50}
          />

          <InputField
            label="Business Phone Number"
            placeholder="9876543210"
            helperText={
              phoneError || "Used for order notifications and authentication."
            }
            type="tel" // ✅ IMPORTANT
            name="businessPhone"
            onChange={handleChange}
            value={formData.businessPhone}
            maxLength={10}
          />

          <ContinueBtn />
        </form>
      </div>
    </div>
  );
};

export default VendorForm;