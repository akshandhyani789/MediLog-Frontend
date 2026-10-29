
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getAPIBaseURL } from "../../../../../utils/ipDetection";

const API_BASE_URL = getAPIBaseURL();
const medicineCategories = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Drops",
  "Sachet",
  "Other",
];

const isValidExpiryDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export default function EditMedicineModal({ medicine, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: medicine?.name || "",
    brand: medicine?.brand || "",
    category: medicine?.category || "Tablet",
    stock: medicine?.stock?.toString() || "0",
    expiryDate: medicine?.expiryDate
      ? medicine.expiryDate.split("T")[0]
      : "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (loading) return;

    if (!form.name.trim()) {
      setError("Medicine name is required.");
      return;
    }

    if (
      form.stock.trim() === "" ||
      !Number.isSafeInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setError("Enter a valid, non-negative whole-number stock quantity.");
      return;
    }

    if (!isValidExpiryDate(form.expiryDate)) {
      setError("Enter a valid expiry date.");
      return;
    }

    if (!medicineCategories.includes(form.category)) {
      setError("Select a valid medicine category.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = getAuth().currentUser;

      if (!user) {
        alert("User not logged in");
        return;
      }

      const token = await user.getIdToken();

      const updatedData = {
        customMedicine: {
          name: form.name.trim(),
          brand: form.brand.trim(),
        },
        category: form.category.trim(),
        stock: Number(form.stock),
        expiryDate: form.expiryDate,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/user-medicines/${medicine._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.error || "Failed to update medicine.");
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update medicine.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.10] bg-[#0B1112]/80 px-3.5 py-3 text-sm text-gray-100 placeholder:text-gray-500 outline-none transition duration-200 focus:border-[#00C2C7]/70 focus:ring-2 focus:ring-[#00C2C7]/10";

  const labelClass = "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-medicine-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0B1112]/95 p-6 text-gray-100 shadow-[0_0_60px_rgba(0,194,199,0.08)] backdrop-blur-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle teal glow */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-[#00C2C7]/10 blur-3xl" />

        <div className="relative">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C2C7] shadow-[0_0_10px_rgba(0,194,199,0.8)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00C2C7]">
                  Inventory Management
                </span>
              </div>

              <h2
                id="edit-medicine-title"
                className="text-xl font-semibold tracking-tight text-white"
              >
                Edit Medicine
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Update your medicine details below.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-lg text-gray-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="medicine-name">
                Medicine Name
              </label>
              <input
                id="medicine-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="medicine-brand">
                Brand
              </label>
              <input
                id="medicine-brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="medicine-category">
                Category
              </label>
              <select
                id="medicine-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {medicineCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="medicine-stock">
                  Stock Quantity
                </label>
                <input
                  id="medicine-stock"
                  type="number"
                  min="0"
                  step="1"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="medicine-expiry">
                  Expiry Date
                </label>
                <input
                  id="medicine-expiry"
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className={`${inputClass} [color-scheme:light]`}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/[0.10] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-xl bg-[#00C2C7] px-5 py-2.5 text-sm font-semibold text-[#061112] shadow-[0_0_20px_rgba(0,194,199,0.12)] transition hover:bg-[#28D5D8] hover:shadow-[0_0_24px_rgba(0,194,199,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
