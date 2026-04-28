import React from "react";


export default function ProfileCard({ name, email }) {

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center self-start">
      
      {/* Avatar */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-teal-700 flex items-center justify-center text-white text-3xl font-semibold shadow-md">
          {initial}
        </div>

        <div className="absolute bottom-1 right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm shadow cursor-pointer">
          📷
        </div>
      </div>

      {/* Name */}
      <h2 className="mt-4 text-lg font-semibold text-gray-800 capitalize">
        {name}
      </h2>

      {/* Email */}
      <p className="text-sm text-gray-500 mb-4 break-all">
        {email}
      </p>

      {/* Buttons */}
      <button className="w-full py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">
        Upload New Photo
      </button>

      <button className="w-full py-2 mt-3 rounded-full border border-red-300 text-red-500 font-medium hover:bg-red-50 transition">
        Remove Photo
      </button>
    </div>
  );
}