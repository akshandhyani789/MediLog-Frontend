
import React, { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import Pagination from "./Pagination";
import EditMedicineModal from "./EditMedicineModal";
import { getAuth } from "firebase/auth";
import { getAPIBaseURL } from "../../../../../utils/ipDetection";

const API_BASE_URL = getAPIBaseURL();
const ITEMS_PER_PAGE = 5;

export default function MedicineTable({ filteredMedicine, fetchMedicines }) {
  const [page, setPage] = useState(1);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  const totalPages = Math.ceil(filteredMedicine.length / ITEMS_PER_PAGE);

  const currentData = filteredMedicine.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
    if (page > totalPages) setPage(Math.max(1, totalPages));
  }, [page, totalPages]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      const user = getAuth().currentUser;

      if (!user) {
        alert("User not logged in");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`${API_BASE_URL}/api/user-medicines/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchMedicines();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete medicine");
    }
  };

  const handleEdit = (item) => {
    setSelectedMedicine(item);
    setIsEditOpen(true);
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Not set";

    return parsedDate.toLocaleDateString();
  };

  const getDaysColor = (daysLeft) => {
    if (daysLeft == null) return "text-gray-400";
    if (daysLeft < 0) return "text-red-400";
    if (daysLeft <= 7) return "text-red-400";
    if (daysLeft <= 30) return "text-amber-400";
    return "text-emerald-400";
  };

  const inputLabelClass = "text-xs text-gray-500";

  const actionButtonClass =
    "rounded-lg border px-3 py-1.5 text-xs font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C2C7]/20";

  const editButtonClass =
    `${actionButtonClass} border-white/[0.10] bg-white/[0.03] text-gray-300 hover:border-[#00C2C7]/40 hover:bg-[#00C2C7]/10 hover:text-[#00C2C7]`;

  const deleteButtonClass =
    `${actionButtonClass} border-red-400/20 bg-red-400/[0.05] text-red-400 hover:border-red-400/40 hover:bg-red-400/10`;

  return (
    <>
      {/* MOBILE VIEW */}
      {isMobile ? (
        <div className="space-y-4">
          {currentData.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-12 text-center backdrop-blur-xl">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00C2C7]/20 bg-[#00C2C7]/[0.08] text-[#00C2C7]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path
                    d="M4 7h16M6 7l1 13h10l1-13M9 7V4h6v3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-200">
                No medicines found
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            currentData.map((item) => (
              <div
                key={item._id}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition duration-300 hover:border-[#00C2C7]/20"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#00C2C7]/[0.04] blur-2xl" />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-100">
                      {item.name || "Unnamed medicine"}
                    </h3>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.brand || "No brand specified"}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {/* Details */}
                <div className="relative mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.05] bg-black/10 p-3">
                    <p className={inputLabelClass}>Category</p>
                    <p className="mt-1 truncate text-sm font-medium text-gray-200">
                      {item.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-black/10 p-3">
                    <p className={inputLabelClass}>Stock</p>
                    <p className="mt-1 text-sm font-semibold text-gray-100">
                      {item.stock ?? 0}
                      <span className="ml-1 text-xs font-normal text-gray-500">
                        units
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-black/10 p-3">
                    <p className={inputLabelClass}>Expiry Date</p>
                    <p className="mt-1 text-sm text-gray-300">
                      {formatDate(item.expiryDate)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-black/10 p-3">
                    <p className={inputLabelClass}>Days Left</p>
                    <p
                      className={`mt-1 text-sm font-semibold ${getDaysColor(
                        item.daysLeft
                      )}`}
                    >
                      {item.daysLeft == null ? "—" : `${item.daysLeft} days`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative mt-4 flex justify-end gap-2 border-t border-white/[0.07] pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className={editButtonClass}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className={deleteButtonClass}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      ) : (
        /* DESKTOP VIEW */
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-2xl transition duration-300 hover:border-white/[0.12] sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#00C2C7]/[0.04] blur-3xl" />

          {/* Header */}
          <div className="relative mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C2C7] shadow-[0_0_10px_rgba(0,194,199,0.8)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00C2C7]">
                  Inventory Management
                </span>
              </div>

              <h2 className="text-xl font-semibold tracking-tight text-white">
                Medicine Inventory
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep track of your stock and expiry dates.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-xl border border-white/[0.07] bg-black/10 px-4 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00C2C7]/20 bg-[#00C2C7]/[0.08] text-[#00C2C7]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-4 w-4"
                >
                  <path
                    d="M4 7h16M6 7l1 13h10l1-13M9 7V4h6v3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Total medicines
                </p>
                <p className="text-lg font-semibold tabular-nums text-gray-100">
                  {filteredMedicine.length}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="max-h-[380px] overflow-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead className="sticky top-0 z-10 bg-[#101718] text-gray-400">
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-4 py-4 text-left font-medium">
                      Medicine
                    </th>
                    <th className="px-4 py-4 text-left font-medium">
                      Category
                    </th>
                    <th className="px-4 py-4 text-center font-medium">
                      Stock
                    </th>
                    <th className="px-4 py-4 text-center font-medium">
                      Expiry
                    </th>
                    <th className="px-4 py-4 text-center font-medium">
                      Days Left
                    </th>
                    <th className="px-4 py-4 text-center font-medium">
                      Status
                    </th>
                    <th className="px-4 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.055]">
                  {currentData.map((item) => (
                    <tr
                      key={item._id}
                      className="group transition-colors duration-200 hover:bg-[#00C2C7]/[0.035]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#00C2C7]/15 bg-[#00C2C7]/[0.07] text-[#00C2C7]">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              className="h-4 w-4"
                            >
                              <rect
                                x="4"
                                y="7"
                                width="16"
                                height="10"
                                rx="5"
                                transform="rotate(-30 12 12)"
                              />
                              <path d="m9 8 6 8" strokeLinecap="round" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate font-medium text-gray-100">
                              {item.name || "Unnamed medicine"}
                            </p>
                            <p className="mt-0.5 max-w-[180px] truncate text-xs text-gray-500">
                              {item.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex max-w-[130px] truncate rounded-lg border border-[#00C2C7]/15 bg-[#00C2C7]/[0.07] px-2.5 py-1 text-xs text-[#52D6D8]">
                          {item.category || "Uncategorized"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold tabular-nums text-gray-200">
                          {item.stock ?? 0}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center text-gray-400">
                        {formatDate(item.expiryDate)}
                      </td>

                      <td
                        className={`px-4 py-4 text-center font-semibold tabular-nums ${getDaysColor(
                          item.daysLeft
                        )}`}
                      >
                        {item.daysLeft == null ? "—" : `${item.daysLeft}d`}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className={editButtonClass}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            className={deleteButtonClass}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {currentData.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-gray-300">
                    No medicines found
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative mt-5">
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedMedicine && (
        <EditMedicineModal
          medicine={selectedMedicine}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedMedicine(null);
          }}
          onSuccess={async () => {
            await fetchMedicines();
            setIsEditOpen(false);
            setSelectedMedicine(null);
          }}
        />
      )}
    </>
  );
}
