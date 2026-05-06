import React, { useState, useCallback } from "react";
import Dashboard from "./sections/DashboardSection";
import Profile from "./sections/ProfileSection";
import Alerts from "./sections/AlertsSection";
import StockSection from "./sections/StockSection";
import UserMedicineSection from "./sections/UserMedicineSection";

import FloatingButton from "./componant/FloatingButton";
import AddMedicineModal from "./componant/AddMedicineModal";
import Scanner from "./componant/Scanner";
import OCRScanner from "./componant/OCRScanner";

import { getMedicineByBarcode } from "../../../services/api";
import { useAlertsData } from "../../../hooks/useAlertData";
import { useAuth } from "../../../hooks/useAuth";

function SectionsDataRight({ activePage, setActivePage }) {
  const { userData, user } = useAuth();
  const userRole = userData?.role || "individual";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOCRScannerOpen, setIsOCRScannerOpen] = useState(false);
  const [scannedMedicine, setScannedMedicine] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const alertsData = useAlertsData(user);

  const commonPages = {
    Dashboard: (
      <Dashboard
        setActivePage={setActivePage}
        refetchTrigger={refetchTrigger}
      />
    ),
    MyMedicines: <UserMedicineSection refetchTrigger={refetchTrigger} />,
    Alerts: <Alerts alertsData={alertsData} />,
    Profile: <Profile />,
  };

  const pages =
    userRole === "vendor"
      ? {
          ...commonPages,
          Stock: <StockSection refetchTrigger={refetchTrigger} />,
        }
      : commonPages;

  const handleScanSuccess = async (barcode) => {
    try {
      const data = await getMedicineByBarcode(barcode);
      setScannedMedicine(data);
      setIsScannerOpen(false);
      setIsModalOpen(true);
    } catch (err) {
      console.log("Barcode not found → Opening OCR scanner", err.message);
      setIsScannerOpen(false);
      setIsOCRScannerOpen(true);
    }
  };

  const handleOpenModal = () => {
    setScannedMedicine(null);
    setIsModalOpen(true);
  };

  const handleOCRResult = (data) => {
    setScannedMedicine(data);
    setIsOCRScannerOpen(false);
    setIsModalOpen(true);
  };

  const handleMedicineAdded = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-300 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-300 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 min-h-[calc(100vh-64px)]">
        {pages[activePage] || pages.Dashboard}
      </div>

      <FloatingButton onClick={handleOpenModal} />

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

      {isScannerOpen && (
        <Scanner
          onScan={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
          setIsOCRScannerOpen={setIsOCRScannerOpen}
        />
      )}

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