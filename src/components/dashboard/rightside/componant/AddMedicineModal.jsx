import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import { useAuth } from "../../../../hooks/useAuth";
import { addUserMedicine } from "../../../../services/api";

function AddMedicineModal({ isOpen, onClose, scannedMedicine, openScanner, onMedicineAdded }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    brand: "",
    dosage: "",
    frequency: "",
    expiryDate: "",
    stock: "",
    category: "Tablet",
    maxStock: "",
  });



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 🔥 AUTO-FILL after scan or OCR
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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm({
        name: "",
        brand: "",
        dosage: "",
        frequency: "",
        expiryDate: "",
        stock: "",
        category: "Tablet",
        maxStock: "",
      });
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim()) {
      setError("Medicine name is required");
      return;
    }

    if (!form.expiryDate) {
      setError("Expiry date is required");
      return;
    }

    if (!form.stock || parseInt(form.stock) < 0) {
      setError("Valid stock quantity is required");
      return;
    }

    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const medicineData = {
        customMedicine: {
          name: form.name.trim(),
          brand: form.brand.trim(),
        },
        dosage: form.dosage.trim(),
        frequency: form.frequency.trim(),
        expiryDate: form.expiryDate,
        stock: parseInt(form.stock),
        category: form.category,
        maxStock: form.maxStock ? parseInt(form.maxStock) : 0,
      };

      const result = await addUserMedicine(user, medicineData);

      if (!result) {
        throw new Error("Failed to add medicine");
      }

      setSuccess(true);
      setForm({
        name: "",
        brand: "",
        dosage: "",
        frequency: "",
        expiryDate: "",
        stock: "",
        category: "Tablet",
        maxStock: "",
      });

      // Trigger refetch in parent component
      if (onMedicineAdded) {
        onMedicineAdded();
      }

      // Close modal after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err) {
      console.error("Error adding medicine:", err);
      setError(err.message || "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white w-[90%] max-w-2xl rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quick Add Medicine</h2>
          <button onClick={onClose} disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 📸 Scan Button */}
        <button
          onClick={openScanner}
          disabled={loading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Scan Medicine 📷
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            ✅ Medicine added successfully!
          </div>
        )}

        {/* 🔍 Scanned Data Indicator */}
        {scannedMedicine && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
            📸 Auto-filled from scan: <strong>{scannedMedicine.name}</strong>
            {scannedMedicine.brand && ` (${scannedMedicine.brand})`}
          </div>
        )}

        {/* 🧾 FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Medicine Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter medicine name"
            required
            disabled={loading}
          />

          <InputField
            label="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="Enter brand name"
            disabled={loading}
          />

          <InputField
            label="Dosage"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            placeholder="500mg"
            disabled={loading}
          />

          <InputField
            label="Frequency"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            placeholder="2 times/day"
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Category *"
              as="select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              disabled={loading}
            >
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Drops">Drops</option>
              <option value="Sachet">Sachet</option>
              <option value="Other">Other</option>
            </InputField>

            <InputField
              label="Stock *"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="0"
              min="0"
              required
              disabled={loading}
            />
            
          </div>

          <InputField
            label="Expiry Date *"
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            required
            disabled={loading}
          />

          {/* ✅ Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Medicine..." : "Add Medicine"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMedicineModal;
