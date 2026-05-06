import React, { useEffect, useState } from "react";
import ProfileCard from "../componant/profileComponant/ProfileCard";
import PersonalInfoCard from "../componant/profileComponant/PersonalInfoCard";
import NotificationCard from "../componant/profileComponant/NotificationCard";
import { useAuth } from "../../../../hooks/useAuth";
import { Settings } from "lucide-react";

function Profile() {
  const { userData } = useAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userData) {
      setUser({
        ...userData,
        fullName: userData.fullName || userData.name || "",
        ownerName: userData.ownerName || userData.name || "",
        businessName: userData.businessName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        businessPhone: userData.businessPhone || userData.phone || "",
      });
    }
  }, [userData]);

  if (!user) {
    return (
      <div className="p-6 sm:p-8 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8  min-h-screen">
      <div className="flex items-center gap-3 mb-2">
        <Settings className="w-8 h-8 text-teal-600" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-gray-600 font-medium mt-1">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[320px] shrink-0">
          <ProfileCard
            name={
              user.role === "vendor"
                ? user.ownerName || user.name
                : user.fullName || user.name
            }
            email={user.email}
          />
        </div>

        <div className="flex-1 w-full space-y-6">
          <PersonalInfoCard user={user} setUser={setUser} />
          <NotificationCard />
        </div>
      </div>
    </div>
  );
}

export default Profile;