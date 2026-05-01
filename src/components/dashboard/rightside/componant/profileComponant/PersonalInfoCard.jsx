import React from "react";
import DataField from "./DataField";
import EditButton from "./EditButton";
import { useAuth } from "../../../../../hooks/useAuth";

const PersonalInfoCard = ({user, setUser}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const { userData } = useAuth();
  console.log("PersonalInfoCard user data:", userData);

  const handleEdit = () => {
    if (isEditing) {
      console.log("Saving data:", user);
    }
    setIsEditing((prev) => !prev);
  };

  const handleChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="w-full">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 hover:border-gray-300 transition-all duration-300">

        {/* Header */}
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

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <DataField
            label="Full Name"
            value={user.fullName}
            isEditing={isEditing}
            onChange={(val) => handleChange("fullName", val)}
          />
          <DataField
            label="Email Address"
            value={user.email}
            isEditing={isEditing}
            onChange={(val) => handleChange("email", val)}
          />
          <DataField
            label="Phone Number"
            value={user.phone}
            isEditing={isEditing}
            onChange={(val) => handleChange("phone", val)}
          />
        </div>

      </div>
    </section>
  );
};

export default PersonalInfoCard;