import React, { useEffect, useRef, useState } from "react";
import { Camera, UserRound, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../../../hooks/useAuth";
import { updateUserProfile } from "../../../../../services/api";

export default function ProfileCard({ name, email }) {
  const fileInputRef = useRef(null);
  const { user, userData, setUserData } = useAuth();

  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const displayName =
    name || userData?.name || user?.displayName || "User";

  const displayEmail = email || userData?.email || user?.email || "";
  const baseProfileImage = user?.photoURL || "";
  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  useEffect(() => {
    setProfileImage(userData?.profileImage || "");
  }, [userData?.profileImage]);

  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();

        image.onload = () => {
          const maxSize = 400;
          const scale = Math.min(
            1,
            maxSize / image.width,
            maxSize / image.height
          );

          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);

          const context = canvas.getContext("2d");

          if (!context) {
            reject(new Error("Unable to process this image."));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };

        image.onerror = () => reject(new Error("Unable to read this image."));
        image.src = event.target.result;
      };

      reader.onerror = () => reject(new Error("Unable to read this file."));
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Maximum size is 5 MB.");
      event.target.value = "";
      return;
    }

    const previousImage = profileImage;

    try {
      setUploading(true);

      const compressedImage = await compressImage(file);
      setProfileImage(compressedImage);

      const updatedUser = await updateUserProfile({
        profileImage: compressedImage,
      });

      setUserData((previous) => ({
        ...(previous || userData || {}),
        ...updatedUser,
        profileImage: compressedImage,
      }));
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      setProfileImage(previousImage);
      alert("Failed to upload profile image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const currentImage = profileImage || baseProfileImage;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-colors duration-300 hover:border-white/[0.13]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-teal-400/[0.055] to-transparent" />

      <div className="relative flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full border border-teal-400/30 bg-gradient-to-br from-teal-400/20 to-teal-900/30 text-lg font-bold text-teal-100 shadow-[0_0_25px_rgba(0,194,199,0.08)] sm:h-[74px] sm:w-[74px]">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${displayName}'s profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#101515] bg-teal-400">
              <CheckCircle2 className="h-3 w-3 text-[#062020]" />
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-gray-100 sm:text-2xl">
              {displayName}
            </h2>

            <p className="mt-1 break-all text-sm text-gray-400">
              {displayEmail}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
              <span className="text-xs font-medium text-gray-400">
                {userData?.role === "vendor" ? "Vendor account" : "Individual account"}
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-xs text-gray-500">MediLog</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3 sm:justify-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.035] px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-teal-300/30 hover:bg-teal-300/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera className="h-4 w-4 text-teal-300" />
            {uploading ? "Uploading..." : "Change photo"}
          </button>
        </div>
      </div>
    </section>
  );
}
