
import React, { useEffect, useState } from "react";
import { Check, Pencil, X, MapPin } from "lucide-react";

const DEMO_PROFILE = {
  fullName: "Akshan Dhyani",
  email: "akshan.demo@example.com",
  phone: "9876543210",
  role: "individual",
  city: "Dehradun",
  state: "Uttarakhand",
  searchLocation: "Clement Town, Dehradun, Uttarakhand",
};

const labelClass =
  "mb-2 block text-xs font-semibold text-gray-400";

const inputClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#080C0C]/90 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/10 disabled:cursor-not-allowed disabled:opacity-90";

export default function PersonalInfoCard({
  profile,
  onProfileChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile || DEMO_PROFILE);
  const [phoneError, setPhoneError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setDraft(profile || DEMO_PROFILE);
  }, [profile]);

  const handleChange = (field, value) => {
    setSaveMessage("");

    if (field === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);

      setDraft((previous) => ({
        ...previous,
        phone: digits,
      }));

      setPhoneError(
        digits.length === 10 && !/^[6-9]\d{9}$/.test(digits)
          ? "Enter a valid 10-digit Indian mobile number."
          : ""
      );

      return;
    }

    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setDraft({ ...(profile || DEMO_PROFILE) });
    setPhoneError("");
    setSaveMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft({ ...(profile || DEMO_PROFILE) });
    setPhoneError("");
    setSaveMessage("");
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!/^[6-9]\d{9}$/.test(draft.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    // Demo-only save: update parent React state, not the backend.
    if (onProfileChange) {
      onProfileChange({ ...draft });
    }

    setPhoneError("");
    setSaveMessage("Demo profile updated successfully.");
    setIsEditing(false);
  };

  const Field = ({ label, field, disabled = false }) => (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>

      <input
        type="text"
        value={draft[field] || ""}
        disabled={!isEditing || disabled}
        onChange={(event) =>
          handleChange(field, event.target.value)
        }
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
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-teal-300/30 hover:bg-teal-300/[0.07] sm:self-center"
          >
            <Pencil className="h-4 w-4 text-teal-300" />
            Edit profile
          </button>
        )}
      </div>

      {/* Form fields */}
      <div className="p-5 sm:p-7">
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 md:gap-x-6 md:gap-y-6">

          <Field label="Full name" field="fullName" />

          <Field
            label="Email address"
            field="email"
            disabled
          />

          <Field label="Phone number" field="phone" />

          <div className="min-w-0">
            <label className={labelClass}>Account type</label>

            <select
              value={draft.role || "individual"}
              disabled
              className={`${inputClass} appearance-auto`}
            >
              <option value="individual">Individual</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <Field label="City" field="city" />

          <Field label="State" field="state" />

          {/* Full-width location field */}
          <div className="min-w-0 md:col-span-2">
            <label className={labelClass}>
              Default search location
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-[#080C0C]/90 px-4 py-3 transition focus-within:border-teal-400/50 focus-within:ring-2 focus-within:ring-teal-400/10">
              <MapPin className="h-5 w-5 shrink-0 text-gray-500" />

              <input
                type="text"
                value={draft.searchLocation || ""}
                disabled={!isEditing}
                onChange={(event) =>
                  handleChange("searchLocation", event.target.value)
                }
                placeholder="Enter your preferred search location"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Used only when you initiate a nearby medicine search.
            </p>
          </div>
        </div>

        {phoneError && (
          <p
            role="alert"
            className="mt-4 text-xs font-medium text-red-400"
          >
            {phoneError}
          </p>
        )}

        {saveMessage && (
          <p className="mt-4 text-sm font-medium text-teal-300">
            {saveMessage}
          </p>
        )}

        {/* Form actions */}
        {isEditing && (
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/[0.07]"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00C2C7] px-5 py-3 text-sm font-semibold text-[#041112] shadow-[0_0_25px_rgba(0,194,199,0.12)] transition hover:bg-[#28D3D5]"
            >
              <Check className="h-4 w-4" />
              Save changes
            </button>
          </div>
        )}

        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <p className="text-xs text-gray-500">
            Demo mode · Changes reset when you reload the page.
          </p>
        </div>
      </div>
    </section>
  );
}
