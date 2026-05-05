import React, { useEffect, useState } from "react";
import DataField from "./DataField";
import EditButton from "./EditButton";
import { isValidIndianPhone } from "../../../../../utils/phoneValidator";
import { updateUserProfile } from "../../../../../services/api";
import { useAuth } from "../../../../../hooks/useAuth";

const PersonalInfoCard = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userData, setUserData } = useAuth();
  const userRole = userData?.role || user?.role || "individual";

  const [phoneError, setPhoneError] = useState("");

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    ownerName: "",
    businessName: "",
    email: "",
    phone: "",
    businessPhone: "",
  });

  useEffect(() => {
    const currentUser = userData || user;

    if (currentUser) {
      setUserInfo({
        fullName: currentUser.fullName || currentUser.name || "",
        ownerName: currentUser.ownerName || currentUser.name || "",
        businessName: currentUser.businessName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        businessPhone: currentUser.businessPhone || currentUser.phone || "",
      });
    }
  }, [user, userData]);

  const handleChange = (field, value) => {
    if (field === "phone" || field === "businessPhone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);

      setUserInfo((prev) => ({
        ...prev,
        [field]: onlyDigits,
      }));

      if (onlyDigits.length === 10 && !isValidIndianPhone(onlyDigits)) {
        setPhoneError("Enter a valid 10-digit Indian mobile number.");
      } else {
        setPhoneError("");
      }

      return;
    }

    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleEdit = async () => {
  if (!isEditing) {
    setIsEditing(true);
    return;
  }

  const phoneToValidate =
    userRole === "vendor" ? userInfo.businessPhone : userInfo.phone;

  if (!isValidIndianPhone(phoneToValidate)) {
    setPhoneError("Enter a valid 10-digit Indian mobile number.");
    return;
  }

  try {
    const payload =
      userRole === "vendor"
        ? {
            name: userInfo.ownerName,
            ownerName: userInfo.ownerName,
            businessName: userInfo.businessName,
            businessPhone: userInfo.businessPhone,
            phone: userInfo.businessPhone,
          }
        : {
            name: userInfo.fullName,
            fullName: userInfo.fullName,
            phone: userInfo.phone,
          };

    const res = await updateUserProfile(payload);

    const updatedUser = { ...res };

    if (setUser) setUser(updatedUser);

    // 🔥 MOST IMPORTANT FIX
    setUserData(updatedUser);

    setUserInfo({
      fullName: updatedUser.fullName || updatedUser.name || "",
      ownerName: updatedUser.ownerName || updatedUser.name || "",
      businessName: updatedUser.businessName || "",
      email: updatedUser.email || "",
      phone: updatedUser.phone || "",
      businessPhone: updatedUser.businessPhone || updatedUser.phone || "",
    });

    setIsEditing(false);
    setPhoneError("");

  } catch (err) {
    console.error("❌ Profile update failed:", err);
  }
};
  if (!user && !userData) return null;

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
          {userRole === "vendor" && (
            <DataField
              label="Business Name"
              value={userInfo.businessName}
              isEditing={isEditing}
              onChange={(val) => handleChange("businessName", val)}
            />
          )}

          {userRole === "vendor" ? (
            <DataField
              label="Owner Name"
              value={userInfo.ownerName}
              isEditing={isEditing}
              onChange={(val) => handleChange("ownerName", val)}
            />
          ) : (
            <DataField
              label="Full Name"
              value={userInfo.fullName}
              isEditing={isEditing}
              onChange={(val) => handleChange("fullName", val)}
            />
          )}

          <DataField
            label="Email Address"
            value={userInfo.email}
            isEditing={isEditing}
            onChange={(val) => handleChange("email", val)}
            isDisable={true}
          />

          <div>
            <DataField
              label={userRole === "vendor" ? "Business Phone" : "Phone Number"}
              value={
                userRole === "vendor"
                  ? userInfo.businessPhone
                  : userInfo.phone
              }
              isEditing={isEditing}
              onChange={(val) =>
                handleChange(
                  userRole === "vendor" ? "businessPhone" : "phone",
                  val
                )
              }
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