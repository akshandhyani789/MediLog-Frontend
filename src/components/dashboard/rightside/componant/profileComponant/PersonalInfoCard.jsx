import React from "react";
import DataField from "./DataField";
import EditButton from "./EditButton";
import { useAuth } from "../../../../../hooks/useAuth";

const PersonalInfoCard = ({user, setUser}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  

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
      <div className="bg-white rounded-[1.2rem] shadow-sm border border-gray-50 p-8 md:p-12">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold text-slate-900">
            Personal Information
          </h2>

          <EditButton onClick={handleEdit}>
            {isEditing ? "Save" : "Edit"}
          </EditButton>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
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