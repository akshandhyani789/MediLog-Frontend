import React, { useEffect, useState } from "react";
import DataField from "./DataField";
import EditButton from "./EditButton";
import { isValidIndianPhone } from "../../../../../utils/phoneValidator";
import { updateUserProfile } from "../../../../../services/api";

const PersonalInfoCard = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.fullName || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    if (field === "phone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);

      setUserData((prev) => ({
        ...prev,
        phone: onlyDigits,
      }));

      if (onlyDigits.length === 10 && !isValidIndianPhone(onlyDigits)) {
        setPhoneError("Enter a valid 10-digit Indian mobile number.");
      } else {
        setPhoneError("");
      }

      return;
    }

    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!isValidIndianPhone(userData.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      const res = await updateUserProfile({
        name: userData.fullName,
        phone: userData.phone,
      });

      const updatedUser = {
        ...user,
        ...res,
        fullName: res.fullName || res.name || userData.fullName,
        name: res.name || userData.fullName,
        email: res.email || userData.email,
        phone: res.phone || userData.phone,
      };

      setUser(updatedUser);
      setUserData({
        fullName: updatedUser.fullName || updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      setIsEditing(false);
      setPhoneError("");
    } catch (err) {
      console.error("❌ Profile update failed:", err);
    }
  };

  if (!user) return null;

  return (
    <section className="w-full">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 hover:border-gray-300 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Personal Information
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Manage your account details
            </p>
          </div>

          <EditButton onClick={handleEdit}>
            {isEditing ? "Save Changes" : "Edit"}
          </EditButton>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <DataField
            label="Full Name"
            value={userData.fullName}
            isEditing={isEditing}
            onChange={(val) => handleChange("fullName", val)}
          />

          <DataField
            label="Email Address"
            value={userData.email}
            isEditing={isEditing}
            onChange={(val) => handleChange("email", val)}
            isDisable={true}
          />

          <div>
            <DataField
              label="Phone Number"
              value={userData.phone}
              isEditing={isEditing}
              onChange={(val) => handleChange("phone", val)}
            />

            {phoneError && (
              <p className="mt-2 text-sm text-red-600">{phoneError}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoCard;