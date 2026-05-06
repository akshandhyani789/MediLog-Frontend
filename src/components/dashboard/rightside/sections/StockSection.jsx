import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { getUserMedicines } from "../../../../services/api";

import StockOverviewCards from "../componant/stockComponants/StockOverviewCards";
import CriticalStockList from "../componant/stockComponants/CriticalStockList";
import StockActions from "../componant/stockComponants/StockActions";
import StockUpdateModal from "../componant/stockComponants/StockUpdateModal";

function StockSection({ refetchTrigger = 0 }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("increase");

  const { user } = useAuth();

  const fetchMedicines = useCallback(async () => {
    if (!user) {
      setMedicines([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserMedicines(user);
      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines, refetchTrigger]);

  const updateStock = (id, change) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med._id === id
          ? {
              ...med,
              stock: Math.max(0, Number(med.stock || 0) + change),
            }
          : med
      )
    );
  };

  const handleOpenModal = (action) => {
    setSelectedAction(action);
    setIsStockModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsStockModalOpen(false);
  };

  const handleModalSubmit = (updatedMedicine) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med._id === updatedMedicine._id ? updatedMedicine : med
      )
    );
    setIsStockModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 min-h-screen  to-teal-50/40 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
            Inventory Control
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-950">
            Stock Management
          </h1>
          <p className="mt-2 text-gray-500">
            Monitor, update, and control medicine stock levels.
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-white shadow-sm text-sm font-semibold text-teal-700">
          Smart Stock Panel
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <StockOverviewCards medicines={medicines} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <CriticalStockList
                medicines={medicines}
                updateStock={updateStock}
              />
            </div>

            <StockActions 
              onAddStock={() => handleOpenModal("increase")}
              onReduceStock={() => handleOpenModal("decrease")}
            />
          </div>
        </>
      )}

      {isStockModalOpen && (
        <StockUpdateModal
          isOpen={isStockModalOpen}
          medicines={medicines}
          mode={selectedAction}
          user={user}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

export default StockSection;