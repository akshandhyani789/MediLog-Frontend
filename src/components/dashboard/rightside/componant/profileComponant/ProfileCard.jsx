import React from "react";
import { Camera, Trash2 } from "lucide-react";


export default function ProfileCard({ name, email }) {

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center self-start hover:border-gray-300 transition-all duration-300">
      
      {/* Avatar */}
      <div className="relative group">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          {initial}
        </div>

        <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 group-hover:scale-110">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Name */}
      <h2 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900 capitalize">
        {name}
      </h2>

      {/* Email */}
      <p className="text-sm text-gray-500 font-medium mb-2 mt-1 break-all">
        {email}
      </p>

      {/* Status */}
      <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-700">Active</span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

      {/* Action Buttons */}
      <button className="w-full py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2">
        <Camera className="w-4 h-4" />
        Upload Photo
      </button>

      <button className="w-full py-2.5 mt-3 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-2">
        <Trash2 className="w-4 h-4" />
        Remove Photo
      </button>
    </div>
  );
}