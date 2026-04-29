import React, { useState, useCallback } from "react";
import UserMedicine from "./sections/UserMedicineSection";
import Dashboard from "./sections/DashboardSection";
import Profile from "./sections/ProfileSection";
import Alerts from "./sections/AlertsSection";
import FloatingButton from "./componant/FloatingButton";
import AddMedicineModal from "./componant/AddMedicineModal";
import Scanner from "./componant/Scanner";
import OCRScanner from "./componant/OCRScanner";
import { getMedicineByBarcode } from "../../../services/api";

function SectionsDataRight({ activePage, setActivePage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOCRScannerOpen, setIsOCRScannerOpen] = useState(false);
  const [scannedMedicine, setScannedMedicine] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const pages = {
    Dashboard: <Dashboard setActivePage={setActivePage} refetchTrigger={refetchTrigger} />,
    MyMedicines: <UserMedicine refetchTrigger={refetchTrigger} />,
    Alerts: <Alerts />,
    Profile: <Profile />,
  };

  // 🔥 BARCODE SCAN HANDLER
  const handleScanSuccess = async (barcode) => {
    try {
      // ✅ BARCODE FOUND → open AddMedicineModal with data
      const data = await getMedicineByBarcode(barcode);
      setScannedMedicine(data);
      setIsScannerOpen(false);
      setIsModalOpen(true);
    } catch (err) {
      // ❌ BARCODE NOT FOUND → close scanner, open OCR
      console.log("Barcode not found → Opening OCR scanner", err.message);
      setIsScannerOpen(false);
      setIsOCRScannerOpen(true);
    }
  };

  // 🔥 MANUAL ADD (from floating button)
  const handleOpenModal = () => {
    setScannedMedicine(null);
    setIsModalOpen(true);
  };

  // 🔥 OCR RESULT HANDLER
  const handleOCRResult = (data) => {
    setScannedMedicine(data);
    setIsOCRScannerOpen(false);
    setIsModalOpen(true);
  };

  const handleMedicineAdded = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white min-h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4">
        {pages[activePage] || <Dashboard setActivePage={setActivePage} />}
      </div>

      {/* ➕ Floating Button */}
      <FloatingButton onClick={handleOpenModal} />

      {/* 📦 Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scannedMedicine={scannedMedicine}
        openScanner={() => {
          setIsModalOpen(false);
          setIsScannerOpen(true);
        }}
        onMedicineAdded={handleMedicineAdded}
      />

      {/* 📷 Barcode Scanner */}
      {isScannerOpen && (
        <Scanner
          onScan={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
          setIsOCRScannerOpen={setIsOCRScannerOpen}
        />
      )}

      {/* 🔍 OCR Scanner */}
      {isOCRScannerOpen && (
        <OCRScanner
          onClose={() => setIsOCRScannerOpen(false)}
          onResult={handleOCRResult}
        />
      )}
    </div>
  );
}


export default SectionsDataRight;