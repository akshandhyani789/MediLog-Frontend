import React from 'react'
import ProfileCard from '../componant/profileComponant/ProfileCard'
import PersonalInfoCard from '../componant/profileComponant/PersonalInfoCard'
import NotificationCard from '../componant/profileComponant/NotificationCard'
import { useAuth } from "../../../../hooks/useAuth";

function Profile() {

  const { userData } = useAuth();
  
  console.log("User Data in PersonalInfoCard:", userData); // ✅ DEBUGGING

  const [user, setUser] = React.useState({
    fullName: userData?.name || "Althea Reed",
    email: userData?.email || "abc@gmail.com",
    phone: userData?.phone || "+1(555) 012-3456"
  });

  return (
    <div className="p-6">
      <h1 className='text-2xl font-bold mb-6'>Profile & Settings</h1>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* LEFT */}
        <div className="w-full lg:w-[280px] shrink-0">
          <ProfileCard 
            name={user.fullName}
            email={user.email}
          />
        </div>

        {/* RIGHT */}
        <div className="flex-1 w-full">
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