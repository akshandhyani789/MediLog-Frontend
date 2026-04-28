import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { sendUserToBackend } from "../services/api";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // firebase user
  const [userData, setUserData] = useState(null); // ✅ backend user
  const [isOnboarded, setIsOnboarded] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      console.log("Firebase user authenticated:", currentUser);
      
      const backendRes = await sendUserToBackend(currentUser);

      if (!backendRes) {
        console.error("⚠️ Backend connection failed. Check if server is running on port 5000");
        setUser(currentUser); // Still set Firebase user
        setUserData(null);
        setIsOnboarded(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setUserData(backendRes.user);
      setIsOnboarded(backendRes.user?.isOnboarded);
    } else {
      setUser(null);
      setUserData(null);
      setIsOnboarded(null);
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  return (
    <AuthContext.Provider value={{ user, userData, setUserData, isOnboarded, setIsOnboarded, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useContext } from "react";

export const useAuth = () => {
  return useContext(AuthContext);
};