import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
    >
      Logout
    </button>
  );
}

export default LogoutButton;