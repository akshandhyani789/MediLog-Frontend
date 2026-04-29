import React, { useState } from "react";
import { getAuth } from "firebase/auth";

export default function EditMedicineModal({ medicine, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: medicine.name || "",
    brand: medicine.brand || "",
    category: medicine.category || "",
    stock: medicine.stock || 0,
    expiryDate: medicine.expiryDate?.split("T")[0] || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        alert("User not logged in");
        return;
      }

      const token = await user.getIdToken();

      // ✅ FIXED BODY STRUCTURE
      const updatedData = {
        customMedicine: {
          name: form.name,
          brand: form.brand,
        },
        category: form.category,
        stock: Number(form.stock),
        expiryDate: form.expiryDate,
      };

      const res = await fetch(
        `http://localhost:5000/api/user-medicines/${medicine._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      onSuccess();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update medicine");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Edit Medicine
        </h2>

        <div className="space-y-3">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded-lg"
          />

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border p-2 rounded-lg"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}