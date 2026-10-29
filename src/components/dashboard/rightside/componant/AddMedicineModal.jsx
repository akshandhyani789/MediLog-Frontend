
import React, { useEffect, useState } from "react";
import { X, ScanLine, Pill, CheckCircle2, AlertCircle } from "lucide-react";
import InputField from "./InputField";
import { useAuth } from "../../../../hooks/useAuth";
import { addUserMedicine } from "../../../../services/api";

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

function AddMedicineModal({
  isOpen,
  onClose,
  scannedMedicine,
  openScanner,
  onMedicineAdded,
}) {
  const { user } = useAuth();

  const initialForm = {
    name: "",
    brand: "",
    dosage: "",
    frequency: "",
    expiryDate: "",
    stock: "",
    category: "Tablet",
    maxStock: "",
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Automatically fill fields after barcode scanning or OCR.
  useEffect(() => {
    if (scannedMedicine) {
      setForm((prev) => ({
        ...prev,
        name: scannedMedicine.name || "",
        brand: scannedMedicine.brand || "",
        dosage: scannedMedicine.dosage || "",
        category: scannedMedicine.category || "Tablet",
      }));
    }
  }, [scannedMedicine]);

  // Reset the form when the modal closes.
  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Keep the background page from scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Medicine name is required.");
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

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setError("Enter a valid, non-negative whole-number stock quantity.");
      return;
    }

    if (form.maxStock !== "" && (
      !Number.isInteger(Number(form.maxStock)) ||
      Number(form.maxStock) < 0
    )) {
      setError("Maximum stock must be a non-negative whole number.");
      return;
    }

    if (!user) {
      setError("User not authenticated. Please sign in again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const medicineData = {
        customMedicine: {
          name: form.name.trim(),
          brand: form.brand.trim(),
        },
        dosage: form.dosage.trim(),
        frequency: form.frequency.trim(),
        expiryDate: form.expiryDate,
        stock: Number(form.stock),
        category: form.category,
        maxStock: form.maxStock ? Number(form.maxStock) : 0,
      };

      const result = await addUserMedicine(user, medicineData);

      if (!result) {
        throw new Error("Failed to add medicine.");
      }

      setSuccess(true);
      setForm(initialForm);

      if (onMedicineAdded) {
        await onMedicineAdded();
      }

      // Preserve the original brief success message before closing.
      window.setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Error adding medicine:", err);
      setError(err.message || "Failed to add medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fieldClass =
    "w-full rounded-xl border border-white/[0.09] bg-[#080C0C]/90 px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-gray-600 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/10 disabled:cursor-not-allowed disabled:opacity-50";

  const labelClass =
    "mb-2 block text-xs font-semibold tracking-wide text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-5">
      {/* Dark overlay */}
      <button
        type="button"
        aria-label="Close medicine modal"
        disabled={loading}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/75 backdrop-blur-md"
      />

      {/* Glass modal */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-medicine-title"
        className="relative my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.10] bg-[#0B1010]/95 shadow-[0_25px_100px_rgba(0,0,0,0.65),0_0_50px_rgba(0,194,199,0.04)] backdrop-blur-2xl"
      >
        {/* Subtle teal glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-teal-400/[0.07] to-transparent" />

        {/* Header */}
        <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/[0.08]">
              <Pill className="h-5 w-5 text-teal-300" />
            </div>

            <div>
              <h2
                id="add-medicine-title"
                className="text-lg font-semibold tracking-tight text-gray-100 sm:text-xl"
              >
                Add medicine
              </h2>
              <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                Add medicine details to your inventory.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 transition hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative space-y-5 p-5 sm:p-7">
          {/* Scanner */}
          <button
            type="button"
            onClick={openScanner}
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-teal-400/20 bg-teal-400/[0.06] px-4 py-3 text-sm font-semibold text-teal-200 transition hover:border-teal-300/40 hover:bg-teal-400/[0.11] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ScanLine className="h-4 w-4 transition-transform group-hover:scale-110" />
            Scan medicine barcode / label
          </button>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3.5 text-sm text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-teal-400/20 bg-teal-400/[0.06] p-3.5 text-sm text-teal-200"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Medicine added successfully!</p>
            </div>
          )}

          {/* Scan indicator */}
          {scannedMedicine && (
            <div className="rounded-xl border border-sky-400/20 bg-sky-400/[0.05] p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                <ScanLine className="mr-2 inline h-4 w-4" />
                Scan detected
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Auto-filled from scan:{" "}
                <span className="font-semibold text-white">
                  {scannedMedicine.name}
                </span>
                {scannedMedicine.brand && (
                  <span className="text-gray-400">
                    {" "}({scannedMedicine.brand})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Medicine form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Medicine name *</label>
                <InputField
                  label=""
                  value={form.name}
                  onChange={(e) =>
                    handleFieldChange("name", e.target.value)
                  }
                  placeholder="Enter medicine name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass}>Brand</label>
                <InputField
                  label=""
                  value={form.brand}
                  onChange={(e) =>
                    handleFieldChange("brand", e.target.value)
                  }
                  placeholder="Enter brand name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass}>Dosage</label>
                <InputField
                  label=""
                  value={form.dosage}
                  onChange={(e) =>
                    handleFieldChange("dosage", e.target.value)
                  }
                  placeholder="e.g. 500 mg"
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass}>Frequency</label>
                <InputField
                  label=""
                  value={form.frequency}
                  onChange={(e) =>
                    handleFieldChange("frequency", e.target.value)
                  }
                  placeholder="e.g. 2 times/day"
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  disabled={loading}
                  className={fieldClass}
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Drops">Drops</option>
                  <option value="Sachet">Sachet</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Stock quantity *</label>
                <InputField
                  label=""
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    handleFieldChange("stock", e.target.value)
                  }
                  placeholder="e.g. 20"
                  min="0"
                  step="1"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass}>Expiry date *</label>
                <InputField
                  label=""
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    handleFieldChange("expiryDate", e.target.value)
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass}>Maximum stock</label>
                <InputField
                  label=""
                  type="number"
                  value={form.maxStock}
                  onChange={(e) =>
                    handleFieldChange("maxStock", e.target.value)
                  }
                  placeholder="Optional"
                  min="0"
                  step="1"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-white/[0.10] bg-white/[0.035] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00C2C7] px-6 py-3 text-sm font-semibold text-[#041112] shadow-[0_0_25px_rgba(0,194,199,0.12)] transition hover:bg-[#28D3D5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#041112]/30 border-t-[#041112]" />
                )}
                {loading ? "Adding medicine..." : "Add medicine"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AddMedicineModal;
