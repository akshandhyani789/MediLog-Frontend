import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats  } from "html5-qrcode";
import { requestCameraPermission } from "../../../../utils/mobileOptimization.js";
import { stopCameraStream, getErrorMessage } from "../../../../utils/cameraHelper.js";

function Scanner({ onScan, onClose, setIsOCRScannerOpen }) {
  const html5QrCodeRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [message, setMessage] = useState(
    "📷 Requesting camera access..."
  );
  const [cameraError, setCameraError] = useState(null);
  const [isRetryable, setIsRetryable] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);

  // 🔁 For double-scan validation
  const lastScanRef = useRef("");
  const sameCountRef = useRef(0);

  // ✅ Safe stop
  const safeStopScanner = async () => {
    console.log("[Scanner] 🛑 Stopping scanner...");
    try {
      if (html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState();
        console.log("[Scanner] Current state:", state);
        if (state === 2) {
          await html5QrCodeRef.current.stop();
          console.log("[Scanner] Scanner stopped");
          await html5QrCodeRef.current.clear();
          console.log("[Scanner] Scanner cleared");
        }
      }
    } catch (err) {
      console.warn("[Scanner] Safe stop error:", err.message);
    }
  };

  // 🔄 Retry scanning
  const handleRetry = async () => {
    console.log("[Scanner] 🔄 Retrying scan...");
    hasScannedRef.current = false;
    lastScanRef.current = "";
    sameCountRef.current = 0;
    setCameraError(null);
    setScannerReady(false);
    setMessage("📷 Restarting camera...");
    
    // Restart scanner
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === 1) {
          // Already running
          console.log("[Scanner] Scanner already running");
          setMessage("📷 Scanning... Align barcode inside box & hold steady");
          setScannerReady(true);
          return;
        }
      } catch (err) {
        console.log("[Scanner] State check error, will reinitialize");
      }
    }
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        console.log("[Scanner] 📷 Starting barcode scanner...");

        // ✅ Request camera permission first (for mobile)
        console.log("[Scanner] Checking camera permission...");
        const permissionResult = await requestCameraPermission();
        
        if (!permissionResult.success) {
          console.error("[Scanner] Permission denied:", permissionResult);
          const errorMsg = permissionResult.message || "Camera permission denied";
          setMessage(errorMsg);
          setCameraError({
            type: permissionResult.errorType,
            message: errorMsg,
            details: permissionResult.errorDetails,
          });
          setIsRetryable(permissionResult.errorType !== "insecure_origin" && permissionResult.errorType !== "no_api");
          return;
        }

        console.log("[Scanner] ✅ Camera permission granted");
        setMessage("📷 Scanning... Align barcode inside box & hold steady");

        await html5QrCode.start(
          {
            facingMode: "environment",
          },
          {
            fps: 20, // 🚀 faster scanning
            qrbox: { width: 300, height: 150 }, // 📐 barcode-friendly
            aspectRatio: 1.77,
            disableFlip: false,

            // 🔥 Important: prioritize barcode formats
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
            ],

            videoConstraints: {
              facingMode: "environment",
              advanced: [{ torch: true }], // 💡 flashlight (mobile)
            },
          },

          async (decodedText) => {
            console.log("[Scanner] 📍 Barcode detected:", decodedText);
            
            // 🔁 Double-scan validation
            if (decodedText === lastScanRef.current) {
              sameCountRef.current += 1;
              console.log(`[Scanner] Same barcode detected (${sameCountRef.current} times)`);
            } else {
              lastScanRef.current = decodedText;
              sameCountRef.current = 1;
              console.log("[Scanner] New barcode detected");
            }

            if (sameCountRef.current < 2) return;

            if (hasScannedRef.current) {
              console.log("[Scanner] Already processed a scan, ignoring");
              return;
            }
            
            hasScannedRef.current = true;
            console.log("[Scanner] ✅ Processing scan...");
            setMessage("⏳ Checking barcode...");

            try {
              await onScan(decodedText);
              console.log("[Scanner] ✅ Scan successful");
              setMessage("✅ Found!");

              // ✅ stop AFTER success
              await safeStopScanner();
            } catch (err) {
              console.error("[Scanner] Scan error:", err.message);
              setMessage("❌ Not found → Try OCR");
              await safeStopScanner();
            }
          },

          () => {
            // optional scan failure callback
          }
        );

        console.log("[Scanner] ✅ Scanner initialized successfully");
        setScannerReady(true);

      } catch (err) {
        console.error("[Scanner] Camera start error:", err.name, err.message);
        
        let errorType = "unknown";
        let errorMsg = "Camera access failed. Please try again.";
        let retryable = true;

        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorType = "permission_denied";
          errorMsg = "❌ Camera permission denied. Please enable camera in browser settings.";
          retryable = true;
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorType = "no_camera";
          errorMsg = "❌ No camera found on this device.";
          retryable = false;
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorType = "camera_in_use";
          errorMsg = "⚠️ Camera is already in use. Close other apps and try again.";
          retryable = true;
        } else if (err.name === "OverconstrainedError" || err.name === "ConstraintError") {
          errorType = "constraint_error";
          errorMsg = "⚠️ Camera configuration error. Your device may not support required settings.";
          retryable = true;
        } else if (err.message.includes("Permission denied")) {
          errorType = "permission_denied";
          errorMsg = "❌ Camera permission denied. Please check your browser settings.";
          retryable = true;
        }

        setMessage(errorMsg);
        setCameraError({
          type: errorType,
          message: errorMsg,
          details: err.message,
        });
        setIsRetryable(retryable);
        setScannerReady(false);
      }
    };

    startScanner();

    return () => {
      console.log("[Scanner] 🧹 Cleaning up scanner on unmount");
      safeStopScanner();
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F0FDFA] via-[#F8FAFB] to-[#ECFDF5] p-4">

      {/* ❌ Close Button */}
      <button
        onClick={async () => {
          console.log("[Scanner] Closing scanner");
          await safeStopScanner();
          onClose();
        }}
        className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-800 shadow-sm transition-all hover:bg-teal-50"
        title="Close scanner"
      >
        ✕
      </button>

      {/* 📷 Scanner Container */}
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-900/10 sm:p-7">
        {!cameraError ? (
          <>
            <div id="reader" className="w-full max-w-sm overflow-hidden rounded-xl bg-slate-950 p-1" />
            
            {/* 🧠 Message */}
            <p className="px-4 text-center text-base font-medium text-slate-700 sm:text-lg">
              {message}
            </p>
          </>
        ) : (
          // ❌ Error State with Fallback UI
          <div className="w-full space-y-6">
            <div className="text-center">
              <p className="text-4xl mb-3">{getErrorMessage(cameraError.type).icon}</p>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                {getErrorMessage(cameraError.type).title}
              </h3>
              <p className="mb-4 text-sm text-slate-600">
                {getErrorMessage(cameraError.type).description}
              </p>
              {cameraError.details && (
                <p className="mt-2 text-xs text-slate-500">
                  Technical details: {cameraError.details}
                </p>
              )}
            </div>

            {/* 🔍 Debug Info */}
            <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-600">
              <p>🔧 Debug Info:</p>
              <p>• Error Type: {cameraError.type}</p>
              <p>• Protocol: {window.location.protocol}</p>
              <p>• Hostname: {window.location.hostname}</p>
            </div>
          </div>
        )}

        {/* 🔁 Retry Button */}
        {isRetryable && (
          <button
            onClick={handleRetry}
            className="mt-3 min-h-[44px] w-full rounded-lg bg-amber-100 px-6 py-3 font-medium text-amber-800 transition-all hover:bg-amber-200 sm:w-auto"
            title="Retry camera access"
          >
            🔄 Retry Camera
          </button>
        )}

        {/* 🔀 OCR Fallback Button */}
        <button
          onClick={async () => {
            console.log("[Scanner] Switching to OCR fallback");
            await safeStopScanner();
            setIsOCRScannerOpen(true);
          }}
          className="mt-2 min-h-[44px] w-full rounded-lg bg-gradient-to-r from-teal-700 to-teal-500 px-6 py-3 font-medium text-white transition-all hover:brightness-105 sm:w-auto"
          title="Use OCR text recognition instead"
        >
          📝 Read Text (OCR)
        </button>

        {/* ℹ️ Help Text */}
        {cameraError && (
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-center text-sm text-blue-800">
            <p className="font-semibold mb-2">💡 Troubleshooting Tips:</p>
            <ul className="text-left space-y-1 text-xs">
              {cameraError.type === "permission_denied" && (
                <>
                  <li>• Check if you denied camera permission</li>
                  <li>• Refresh the page and try again</li>
                  <li>• Check browser settings for camera permissions</li>
                </>
              )}
              {cameraError.type === "camera_in_use" && (
                <>
                  <li>• Close other apps using the camera</li>
                  <li>• Check if browser tabs have camera open</li>
                  <li>• Try closing and reopening this page</li>
                </>
              )}
              {cameraError.type === "no_camera" && (
                <>
                  <li>• Connect an external camera</li>
                  <li>• Use OCR text recognition instead</li>
                  <li>• Try uploading a photo manually</li>
                </>
              )}
              {cameraError.type === "insecure_origin" && (
                <>
                  <li>• Use HTTPS or localhost</li>
                  <li>• Don't use ngrok for camera access</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scanner;