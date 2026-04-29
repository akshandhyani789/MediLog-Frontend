import React from 'react'
import ProfileCard from '../componant/profileComponant/ProfileCard'
import PersonalInfoCard from '../componant/profileComponant/PersonalInfoCard'
import NotificationCard from '../componant/profileComponant/NotificationCard'
import { useAuth } from "../../../../hooks/useAuth";
import { Settings } from 'lucide-react';

function Profile() {

  const { userData } = useAuth();
  
  console.log("User Data in PersonalInfoCard:", userData);

  const [user, setUser] = React.useState({
    fullName: userData?.name || "Althea Reed",
    email: userData?.email || "abc@gmail.com",
    phone: userData?.phone || "+1(555) 012-3456"
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Settings className="w-8 h-8 text-teal-600" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Profile & Settings</h1>
          <p className="text-gray-600 font-medium mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT - Profile Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <ProfileCard 
            name={user.fullName}
            email={user.email}
          />
        </div>

        {/* RIGHT - Settings Cards */}
        <div className="flex-1 w-full space-y-6">
          <PersonalInfoCard 
            user={user}
            setUser={setUser}
          />
          <NotificationCard />
        </div>

      </div>
    </div>
  )
}

export default Profile