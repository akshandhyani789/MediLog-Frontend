import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { sendUserToBackend } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
        
          const backendRes = await sendUserToBackend(currentUser);

          if (!backendRes) {
            console.error("Backend connection failed. Check if server is running.");
            setUser(currentUser);
            setUserData(null);
            setIsOnboarded(null);
            return;
          }

          setUser(currentUser);
          setUserData(backendRes.user);
          setIsOnboarded(backendRes.user?.isOnboarded ?? false);
        } else {
          setUser(null);
          setUserData(null);
          setIsOnboarded(null);
        }
      } catch (error) {
        console.error("Auth context error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        setUserData,
        isOnboarded,
        setIsOnboarded,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};