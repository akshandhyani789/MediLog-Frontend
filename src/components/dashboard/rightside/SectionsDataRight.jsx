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
import FindMedicineSection from "./componant/findMedicine/FindMedicineSection";
import MyMedicineBundlesSection from "./componant/findMedicine/MyMedicineBundlesSection";

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
    FindMedicine: <FindMedicineSection/>,
    MyMedicineBundles: <MyMedicineBundlesSection />,
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
    <div className="dashboard-content relative min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-gradient-to-br from-[#F0FAF8] via-white to-[#E0F7F2]">
      {/* Subtle teal background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[300px] w-[300px] rounded-full bg-teal-500/[0.035] blur-[120px]" />

        <div className="absolute -bottom-24 right-0 h-[350px] w-[350px] rounded-full bg-cyan-500/[0.025] blur-[140px]" />
      </div>

      {/* Active page content */}
      <div className="relative z-10 min-h-[calc(100vh-64px)] text-slate-900">
        {pages[activePage] || pages.Dashboard}
      </div>

      {/* Existing add medicine button */}
      <FloatingButton onClick={handleOpenModal} />

      {/* Existing add medicine modal */}
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

      {/* Existing barcode scanner */}
      {isScannerOpen && (
        <Scanner
          onScan={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
          setIsOCRScannerOpen={setIsOCRScannerOpen}
        />
      )}

      {/* Existing OCR scanner */}
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