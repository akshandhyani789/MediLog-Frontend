import React, { useState } from "react";
import InputField from "./InputField";
import ContinueBtn from "./ContinueBtn";
import { useNavigation } from "../../../hooks/useNevigation";
import { isValidIndianPhone } from "../../../utils/phoneValidator";

const IndividualForm = () => {
  const { completeOnboardingAndGoToDashboard } = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
  });

  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        phone: onlyDigits,
      }));

      if (onlyDigits.length === 10 && !isValidIndianPhone(onlyDigits)) {
        setPhoneError("Please enter a valid 10-digit Indian mobile number.");
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

    if (!isValidIndianPhone(formData.phone)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    completeOnboardingAndGoToDashboard(formData);
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] flex flex-col items-center justify-center p-6 font-sans">
      <header className="text-center mb-10 max-w-md">
        <h1 className="text-4xl font-serif text-[#1A2E2C] mb-4">
          Tell us about yourself
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed px-4">
          Complete your profile to customize your experience and begin managing your medicines.
        </p>
      </header>

      <div className="bg-white rounded-[3rem] shadow-sm w-full max-w-lg p-10 md:p-14">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            placeholder="Akshan Dhyani"
            helperText="As you'd like it to appear in your profile."
            onChange={handleChange}
            name="name"
            value={formData.name}
            type="text"
            minLength={3}
            maxLength={50}
          />

          <InputField
            label="Phone Number"
            placeholder="9876543210"
            helperText={phoneError || "Enter a valid 10-digit Indian mobile number."}
            type="tel"
            onChange={handleChange}
            name="phone"
            value={formData.phone}
            maxLength={10}
          />

          <InputField
            label="Age (optional)"
            placeholder="32"
            helperText="Helps personalize your profile."
            type="number"
            onChange={handleChange}
            name="age"
            value={formData.age}
            min={14}
            max={120}
          />

          <ContinueBtn />
        </form>
      </div>
    </div>
  );
};

export default IndividualForm;