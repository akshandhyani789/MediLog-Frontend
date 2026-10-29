
import React, { useState } from "react";
import { Settings, Camera, CheckCircle2 } from "lucide-react";
import PersonalInfoCard from "../componant/profileComponant/PersonalInfoCard";

const DEMO_PROFILE = {
  name: "Akshan Dhyani",
  fullName: "Akshan Dhyani",
  email: "akshan.demo@example.com",
  phone: "9876543210",
  role: "individual",
  city: "Dehradun",
  state: "Uttarakhand",
  searchLocation: "Clement Town, Dehradun, Uttarakhand",
  profileImage: "",
};

export default function ProfileSection() {
  const [profile, setProfile] = useState(DEMO_PROFILE);
  const [photo, setPhoto] = useState("");
  const [uploading, setUploading] = useState(false);

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handlePhotoChange = (event) => {
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

    setUploading(true);

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
      setUploading(false);
    };

    reader.onerror = () => {
      alert("Could not load the selected image.");
      setUploading(false);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const updateProfile = (updatedFields) => {
    setProfile((previous) => ({
      ...previous,
      ...updatedFields,
      name:
        updatedFields.fullName !== undefined
          ? updatedFields.fullName
          : previous.name,
    }));
  };

  return (
    <main className="app-page-background min-h-screen px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px] space-y-7">

        {/* Page heading */}
        <header className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/[0.08]">
            <Settings className="h-5 w-5 text-teal-300" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
              Profile &amp; Settings
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Manage your account and preferences.
            </p>
          </div>
        </header>

        {/* Demo banner */}
        <div className="rounded-xl border border-teal-400/15 bg-teal-400/[0.045] px-4 py-3">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-teal-300">
              Demo mode
            </span>
            {" "}— displaying sample profile information. Changes are temporary and are not sent to the backend.
          </p>
        </div>

        {/* Profile header card */}
        <section className="surface-card relative overflow-hidden rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-teal-400/[0.06] to-transparent" />

          <div className="relative flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-teal-400/30 bg-gradient-to-br from-teal-400/20 to-teal-900/30 text-lg font-bold text-teal-100 sm:h-[74px] sm:w-[74px]">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || "U"
                )}

                <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#101515] bg-teal-400">
                  <CheckCircle2 className="h-3 w-3 text-[#062020]" />
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight text-gray-100 sm:text-2xl">
                  {profile.name}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-400">
                  {profile.email}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Individual account · MediLog demo
                </p>
              </div>
            </div>

            <label className={`inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl border border-white/[0.12] bg-white/[0.035] px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-teal-300/30 hover:bg-teal-300/[0.07] sm:self-center ${uploading ? "pointer-events-none opacity-50" : ""}`}>
              <Camera className="h-4 w-4 text-teal-300" />
              {uploading ? "Loading photo..." : "Change photo"}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* Personal information is a separate component */}
        <PersonalInfoCard
          profile={profile}
          onProfileChange={updateProfile}
        />

        <p className="pb-4 text-center text-xs text-gray-600">
          MediLog · Profile settings · Demo presentation
        </p>
      </div>
    </main>
  );
}
