import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { sendUserToBackend } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let authEventId = 0;
    let unsubscribe;

    const handleAuthState = (currentUser) => {
      if (!active) return;

      const eventId = ++authEventId;

      setUser(currentUser);
      setUserData(null);
      setLoading(false);

      if (!currentUser) return;

      void sendUserToBackend(currentUser)
        .then((backendRes) => {
          if (!active || eventId !== authEventId) return;

          if (!backendRes) {
            console.error("Backend connection failed. Check if server is running.");
            return;
          }

          setUserData((currentData) => currentData ?? backendRes.user ?? null);
        })
        .catch((error) => {
          if (active && eventId === authEventId) {
            console.error("Auth backend sync failed:", error);
          }
        });
    };

    const handleAuthError = (error) => {
      if (!active) return;

      console.error("Firebase auth state error:", error);
      authEventId += 1;
      setUser(null);
      setUserData(null);
      setLoading(false);
    };

    try {
      unsubscribe = onAuthStateChanged(auth, handleAuthState, handleAuthError);
    } catch (error) {
      handleAuthError(error);
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        setUserData,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};