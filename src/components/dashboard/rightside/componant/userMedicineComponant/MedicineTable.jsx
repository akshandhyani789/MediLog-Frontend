import React, { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import Pagination from "./Pagination";
import EditMedicineModal from "./EditMedicineModal";
import { getAuth } from "firebase/auth";

const ITEMS_PER_PAGE = 5;

export default function MedicineTable({ filteredMedicine, fetchMedicines }) {
  const [page, setPage] = useState(1);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const totalPages = Math.ceil(filteredMedicine.length / ITEMS_PER_PAGE);

  const currentData = filteredMedicine.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [filteredMedicine]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);


  // 🔥 DELETE FUNCTION
const handleDelete = async (id) => {
  if (!window.confirm("Delete this medicine?")) return;

  try {
    const user = getAuth().currentUser;

    if (!user) {
      alert("User not logged in");
      return;
    }

    const token = await user.getIdToken(); // 🔥 correct token

    const res = await fetch(
      `http://localhost:5000/api/user-medicines/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Delete failed");

    fetchMedicines();
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete medicine");
  }
};

  // 🔥 EDIT OPEN
  const handleEdit = (item) => {
    setSelectedMedicine(item);
    setIsEditOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Medicine Inventory
          </h2>
          <p className="text-xs text-gray-500">
            Track stock & expiry
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold">{filteredMedicine.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border">
        <div className="max-h-[320px] overflow-y-auto">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Medicine</th>
                <th className="px-4">Category</th>
                <th className="text-center px-4">Stock</th>
                <th className="text-center px-4">Expiry</th>
                <th className="text-center px-4">Days</th>
                <th className="text-center px-4">Status</th>
                <th className="text-right px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {item.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.brand || ""}
                    </div>
                  </td>

                  <td className="px-4">
                    <span className="px-2 py-1 text-xs bg-teal-50 text-teal-600 rounded-md">
                      {item.category || "N/A"}
                    </span>
                  </td>

                  <td className="text-center font-semibold">
                    {item.stock ?? 0}
                  </td>

                  <td className="text-center text-gray-600">
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td
                    className={`text-center font-semibold ${
                      item.daysLeft <= 7
                        ? "text-red-500"
                        : item.daysLeft <= 30
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {item.daysLeft ?? 0}d
                  </td>

                  <td className="text-center">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="text-right px-4 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-xs rounded-lg border hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 text-xs rounded-lg text-red-500 border hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentData.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No medicines found
            </div>
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {/* 🔥 EDIT MODAL */}
      {isEditOpen && (
        <EditMedicineModal
          medicine={selectedMedicine}
          onClose={() => setIsEditOpen(false)}
          onSuccess={() => {
            fetchMedicines();
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
}