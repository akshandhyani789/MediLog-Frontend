import React, { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { updateMedicineStock } from "../../../../../services/api";

function StockUpdateModal({
  isOpen,
  medicines,
  mode,
  user,
  onClose,
  onSubmit,
}) {
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const selectedMedicine = medicines.find((m) => m._id === selectedMedicineId);
  const change = mode === "increase" ? Number(quantity) : -Number(quantity);
  const newStock = selectedMedicine ? (selectedMedicine.stock || 0) + change : 0;

  const handleSubmit = async () => {
    try {
      setError("");

      if (!selectedMedicineId) {
        setError("Please select a medicine");
        return;
      }

      if (!quantity || Number(quantity) <= 0) {
        setError("Quantity must be greater than 0");
        return;
      }

      if (newStock < 0) {
        setError("Cannot reduce stock below 0");
        return;
      }

      if (selectedMedicine.maxStock && newStock > selectedMedicine.maxStock) {
        setError(`Cannot exceed maximum stock of ${selectedMedicine.maxStock}`);
        return;
      }

      setIsSubmitting(true);

      const response = await updateMedicineStock(
        user,
        selectedMedicineId,
        change
      );

      onSubmit(response.medicine);
      setSelectedMedicineId("");
      setQuantity("");
    } catch (err) {
      setError(err.message || "Failed to update stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (value) => {
    if (value === "" || /^\d+$/.test(value)) {
      setQuantity(value);
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-950">
            {mode === "increase" ? "Add Stock" : "Reduce Stock"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Medicine
            </label>
            <select
              value={selectedMedicineId}
              onChange={(e) => {
                setSelectedMedicineId(e.target.value);
                setError("");
              }}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-teal-600 focus:outline-none disabled:bg-gray-100"
            >
              <option value="">-- Choose a medicine --</option>
              {medicines.map((med) => (
                <option key={med._id} value={med._id}>
                  {med.name} ({med.stock || 0} units)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter quantity"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-teal-600 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {selectedMedicine && quantity && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Current</p>
                  <p className="text-lg font-bold text-gray-950">
                    {selectedMedicine.stock || 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    {mode === "increase" ? "+" : "-"}
                  </p>
                  <p className="text-lg font-bold text-teal-600">
                    {quantity}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-semibold">New Stock</p>
                  <p
                    className={`text-lg font-bold ${
                      newStock === 0
                        ? "text-red-600"
                        : newStock < 10
                        ? "text-amber-600"
                        : "text-green-600"
                    }`}
                  >
                    {newStock}
                  </p>
                </div>
              </div>

              {selectedMedicine.maxStock > 0 && (
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Max: {selectedMedicine.maxStock}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedMedicineId || !quantity}
            className={`flex-1 px-4 py-2 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              mode === "increase"
                ? "bg-gradient-to-r from-teal-700 to-teal-600 hover:scale-[1.01] disabled:opacity-70"
                : "bg-gradient-to-r from-red-600 to-red-500 hover:scale-[1.01] disabled:opacity-70"
            }`}
          >
            {mode === "increase" ? (
              <>
                <Plus className="w-4 h-4" /> Add
              </>
            ) : (
              <>
                <Minus className="w-4 h-4" /> Reduce
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockUpdateModal;
