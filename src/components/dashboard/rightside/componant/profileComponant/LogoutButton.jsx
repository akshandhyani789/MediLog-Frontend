import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import MedilogLoader from "@/components/MedilogLoader";

function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true); // show loader

      await new Promise((resolve) => setTimeout(resolve, 1500)); // delay

      await signOut(auth);

      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false); // hide loader
    }
  };

  return (
    <>
      {isLoading && <MedilogLoader />}

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
      >
        Logout
      </button>
    </>
  );
}

export default LogoutButton;