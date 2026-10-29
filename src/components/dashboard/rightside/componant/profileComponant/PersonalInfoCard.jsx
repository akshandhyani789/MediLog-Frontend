import React, { useEffect, useState } from "react";
import { Check, Pencil, X, MapPin } from "lucide-react";

const EMPTY_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  city: "",
  state: "",
  searchLocation: "",
};

const labelClass = "mb-2 block text-xs font-semibold text-gray-400";

const inputClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#080C0C]/90 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/10 disabled:cursor-not-allowed disabled:opacity-70";

export default function PersonalInfoCard({
  profile,
  onProfileChange,
  loading = false,
  loadError = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [phoneError, setPhoneError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Normalize real profile fields from the existing user data.
  const getProfileValues = (data) => ({
    fullName:
      data?.role === "vendor"
        ? data?.ownerName ?? data?.name ?? ""
        : data?.name ?? data?.fullName ?? "",
    email: data?.email ?? "",
    phone:
      data?.role === "vendor"
        ? data?.businessPhone ?? data?.phone ?? ""
        : data?.phone ?? "",
    role: data?.role ?? "",
    city: data?.city ?? "",
    state: data?.state ?? "",
    searchLocation: data?.searchLocation ?? "",
  });

  useEffect(() => {
    if (profile) {
      setDraft(getProfileValues(profile));
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setSaveMessage("");
    setSaveError("");

    if (field === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);

      setDraft((previous) => ({
        ...previous,
        phone: digits,
      }));

      setPhoneError(
        digits.length > 0 &&
          digits.length === 10 &&
          !/^[6-9]\d{9}$/.test(digits)
          ? "Enter a valid 10-digit Indian mobile number."
          : "",
      );

      return;
    }

    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setDraft(getProfileValues(profile));
    setPhoneError("");
    setSaveMessage("");
    setSaveError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(getProfileValues(profile));
    setPhoneError("");
    setSaveMessage("");
    setSaveError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaveMessage("");
    setSaveError("");
    setPhoneError("");

    if (!draft.fullName.trim()) {
      setSaveError("Full name is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(draft.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (typeof onProfileChange !== "function") {
      setSaveError(
        "Profile update is not connected. Please check the parent component.",
      );
      return;
    }

    try {
      setIsSaving(true);

      // The parent must call the existing backend API and
      // resolve this promise only after the save succeeds.
      await onProfileChange({
        ...draft,
        fullName: draft.fullName.trim(),
        phone: draft.phone,
        city: draft.city.trim(),
        state: draft.state.trim(),
        searchLocation: draft.searchLocation.trim(),
      });

      setIsEditing(false);
      setSaveMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      setSaveError(
        error?.message || "Unable to save your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (label, field, disabled = false) => (
    <div className="min-w-0" key={field}>
      <label className={labelClass} htmlFor={`profile-${field}`}>
        {label}
      </label>

      <input
        id={`profile-${field}`}
        type="text"
        value={draft[field] ?? ""}
        disabled={!isEditing || disabled || isSaving}
        onChange={(event) => handleChange(field, event.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className={inputClass}
      />
    </div>
  );

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.13]">
      {/* Card heading */}
      <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-100 sm:text-2xl">
            Personal information
          </h2>

          <p className="mt-1.5 text-sm text-gray-400">
            Manage your account details and contact information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            disabled={!profile}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-teal-300/30 hover:bg-teal-300/[0.07] disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <Pencil className="h-4 w-4 text-teal-300" />
            Edit profile
          </button>
        )}
      </div>

      {/* Profile fields */}
      <div className="p-5 sm:p-7">
        {loading ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-sm text-gray-400">
            Loading your profile...
          </div>
        ) : loadError || !profile ? (
          <div
            role="alert"
            className="rounded-xl border border-red-900/30 bg-red-50 p-5 text-sm text-red-700"
          >
            {loadError || "Your profile is unavailable. Please try again later."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 md:gap-x-6 md:gap-y-6">
            {renderField("Full name", "fullName")}
            {renderField("Email address", "email", true)}
            {renderField("Phone number", "phone")}

            <div className="min-w-0">
              <label className={labelClass} htmlFor="profile-role">
                Account type
              </label>

              <select
                id="profile-role"
                value={draft.role}
                disabled
                className={`${inputClass} appearance-auto`}
              >
                <option value="" disabled>
                  Account type unavailable
                </option>
                <option value="individual">Individual</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            {renderField("City", "city")}
            {renderField("State", "state")}

            {/* Default search location */}
            <div className="min-w-0 md:col-span-2">
              <label className={labelClass} htmlFor="profile-searchLocation">
                Default search location
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-[#080C0C]/90 px-4 py-3 transition focus-within:border-teal-400/50 focus-within:ring-2 focus-within:ring-teal-400/10">
                <MapPin className="h-5 w-5 shrink-0 text-gray-500" />

                <input
                  id="profile-searchLocation"
                  type="text"
                  value={draft.searchLocation}
                  disabled={!isEditing || isSaving}
                  onChange={(event) =>
                    handleChange("searchLocation", event.target.value)
                  }
                  placeholder="Enter your preferred search location"
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Used when you initiate a nearby medicine search.
              </p>
            </div>
          </div>
        )}

        {phoneError && (
          <p role="alert" className="mt-4 text-xs font-medium text-red-400">
            {phoneError}
          </p>
        )}

        {saveError && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-400">
            {saveError}
          </p>
        )}

        {saveMessage && (
          <p role="status" className="mt-4 text-sm font-medium text-teal-300">
            {saveMessage}
          </p>
        )}

        {/* Form actions */}
        {isEditing && (
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/[0.07] disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !profile}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00C2C7] px-5 py-3 text-sm font-semibold text-[#041112] shadow-[0_0_25px_rgba(0,194,199,0.12)] transition hover:bg-[#28D3D5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}

        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <p className="text-xs text-gray-500">
            Your profile information is loaded from your account.
          </p>
        </div>
      </div>
    </section>
  );
}
