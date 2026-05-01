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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // ✅ FIX

  const totalPages = Math.ceil(filteredMedicine.length / ITEMS_PER_PAGE);

  const currentData = filteredMedicine.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // ✅ Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      const token = await user.getIdToken();

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

  const handleEdit = (item) => {
    setSelectedMedicine(item);
    setIsEditOpen(true);
  };

return (
  <>
    {/* 📱 MOBILE VIEW */}
    {isMobile ? (
      <div className="space-y-4">
        {currentData.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {item.brand}
                </p>
              </div>

              <StatusBadge status={item.status} />
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Category</p>
                <p className="font-medium text-gray-800">{item.category}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Stock</p>
                <p className="font-semibold text-gray-900">{item.stock}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Expiry</p>
                <p className="text-gray-700">
                  {new Date(item.expiryDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Days Left</p>
                <p
                  className={`font-semibold ${
                    item.daysLeft <= 7
                      ? "text-red-500"
                      : item.daysLeft <= 30
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {item.daysLeft}d
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      /* 💻 DESKTOP VIEW */
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-all duration-300">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Medicine Inventory
            </h2>
            <p className="text-xs text-gray-500">
              Track stock & expiry
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-semibold text-gray-800">
              {filteredMedicine.length}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="max-h-[350px] overflow-y-auto">
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
                      <div className="font-semibold text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.brand}
                      </div>
                    </td>

                    <td className="px-4">
                      <span className="px-2 py-1 text-xs bg-teal-50 text-teal-600 rounded-md">
                        {item.category}
                      </span>
                    </td>

                    <td className="text-center font-semibold text-gray-800">
                      {item.stock}
                    </td>

                    <td className="text-center text-gray-600">
                      {new Date(item.expiryDate).toLocaleDateString()}
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
                      {item.daysLeft}d
                    </td>

                    <td className="text-center">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* ✅ FIXED BUTTONS */}
                    <td className="text-right px-4 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition"
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
      </div>
    )}

    {/* MODAL */}
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
  </>
);
}