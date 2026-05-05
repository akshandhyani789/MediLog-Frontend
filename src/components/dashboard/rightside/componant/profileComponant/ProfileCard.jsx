import React, { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useAuth } from "../../../../../hooks/useAuth";
import { updateUserProfile } from "../../../../../services/api";

export default function ProfileCard({ name, email }) {
  const fileInputRef = useRef(null);
  const { user, userData, setUserData } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const displayName = name || userData?.name || "User";
  const displayEmail = email || userData?.email || "";
  const BaseProfileImage = user?.photoURL || "";

  useEffect(() => {
    if (userData?.profileImage && !profileImage) {
      setProfileImage(userData.profileImage);
    }
  }, [userData?.profileImage]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };

        img.onerror = reject;
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Max 5MB allowed.");
      return;
    }

    try {
      setUploading(true);

      const compressedBase64Image = await compressImage(file);

      // Show image immediately
      setProfileImage(compressedBase64Image);

      const updatedUser = await updateUserProfile({
        profileImage: compressedBase64Image,
      });

      setUserData((prev) => ({
        ...prev,
        ...updatedUser,
        profileImage: compressedBase64Image,
      }));
    } catch (error) {
      console.error("❌ Failed to upload profile image:", error);
      alert("Failed to upload profile image.");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploading(true);

      setProfileImage("");

      const updatedUser = await updateUserProfile({
        profileImage: "",
      });

      setUserData((prev) => ({
        ...prev,
        ...updatedUser,
        profileImage: "",
      }));
    } catch (error) {
      console.error("❌ Failed to remove profile image:", error);
      alert("Failed to remove profile image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center self-start hover:border-gray-300 transition-all duration-300">
      <div className="relative group">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover shadow-lg border border-gray-200"
          />
        ) : (
          <img src={BaseProfileImage} alt="Profile" className="w-28 h-28 rounded-full object-cover shadow-lg border border-gray-200" />
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 group-hover:scale-110 disabled:opacity-60"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <h2 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900 capitalize">
        {displayName}
      </h2>

      <p className="text-sm text-gray-500 font-medium mb-2 mt-1 break-all">
        {displayEmail}
      </p>

      <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-700">Active</span>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Camera className="w-4 h-4" />
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>

      <button
        type="button"
        disabled={uploading || !profileImage}
        onClick={handleRemoveImage}
        className="w-full py-2.5 mt-3 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        Remove Photo
      </button>
    </div>
  );
}