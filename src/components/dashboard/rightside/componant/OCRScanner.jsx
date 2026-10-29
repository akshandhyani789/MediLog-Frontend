import { useEffect, useRef, useState } from "react";
import { scanMedicineOCR } from "../../../../services/api";
import { extractMedicineData } from "../../../../services/ocrHelper";
import { requestCameraPermission } from "../../../../utils/mobileOptimization.js";
import { stopCameraStream, getErrorMessage, getCameraStream } from "../../../../utils/cameraHelper.js";

function OCRScanner({ onClose, onResult }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("camera"); // "camera" or "upload"
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isRetryable, setIsRetryable] = useState(false);

  // 🛑 Stop Everything (cleanup)
  const stopAll = () => {
    console.log("[OCRScanner] 🛑 Stopping all resources...");
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("[OCRScanner] Cleared auto-scan interval");
    }

    if (streamRef.current) {
      console.log("[OCRScanner] Stopping camera stream");
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }

    setCameraReady(false);
  };

  // 🔁 AUTO SCAN LOOP
  const startAutoScan = () => {
    console.log("[OCRScanner] 🔄 Starting auto-scan loop");
    intervalRef.current = setInterval(() => {
      if (!loading && cameraReady) {
        console.log("[OCRScanner] 📸 Capturing frame...");
        captureFrame();
      }
    }, 2000); // ⏱ every 2 sec
  };

  // 📸 Capture Frame from Camera
  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.warn("[OCRScanner] Video or canvas ref not available");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("[OCRScanner] Canvas context not available");
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        console.warn("[OCRScanner] Video not fully loaded yet");
        return;
      }

      ctx.drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.warn("[OCRScanner] Canvas to blob failed");
          return;
        }

        console.log("[OCRScanner] Frame captured, processing...");
        await processImage(blob);
      }, "image/jpeg", 0.7);
    } catch (err) {
      console.error("[OCRScanner] Frame capture error:", err.message);
    }
  };

  // 🔍 Process Image (camera or upload)
  const processImage = async (blob) => {
    if (!blob) {
      console.warn("[OCRScanner] No blob provided");
      return;
    }

    setLoading(true);
    console.log("[OCRScanner] 🔍 Processing image:", blob.size, "bytes");

    try {
      const data = await scanMedicineOCR(blob);
      console.log("[OCRScanner] OCR response:", data);

      setResult(data);

      if (data.found && data.medicine) {
        // ✅ FOUND IN DATABASE → return medicine data
        console.log("[OCRScanner] ✅ Medicine found in database");
        stopAll();
        onResult(data.medicine);
      } else if (data.text) {
        // ❌ NOT FOUND IN DATABASE → extract from raw text
        console.log("[OCRScanner] Medicine not found, extracting from text...");
        const extractedData = extractMedicineData(data.text);
        console.log("[OCRScanner] Extracted data:", extractedData);

        // Return the extracted data (or let user review it)
        setResult({
          found: false,
          text: data.text,
          extracted: extractedData,
        });
      } else {
        console.log("[OCRScanner] No medicine or text found in response");
        setResult({
          found: false,
          error: "Could not read medicine information. Please try again or upload another image.",
        });
      }
    } catch (err) {
      console.error("[OCRScanner] OCR processing error:", err);
      setResult({
        found: false,
        error: err.message || "OCR processing failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 📁 Handle File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      console.log("[OCRScanner] No file selected");
      return;
    }

    console.log("[OCRScanner] File selected:", file.name, file.size, "bytes");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.warn("[OCRScanner] Invalid file type:", file.type);
      setResult({ found: false, error: "Please upload an image file (JPG, PNG, etc.)" });
      return;
    }

    console.log("[OCRScanner] Processing uploaded file...");
    await processImage(file);
  };

  // ✅ Use Extracted Data
  const handleUseExtracted = () => {
    if (result?.extracted) {
      console.log("[OCRScanner] ✅ Using extracted data");
      stopAll();
      onResult(result.extracted);
    }
  };

  // 🔄 Try Again
  const handleRetry = () => {
    console.log("[OCRScanner] 🔄 Retrying...");
    setResult(null);
    setCameraError(null);
    
    if (mode === "camera" && !cameraReady) {
      // Camera will auto-restart
      console.log("[OCRScanner] Restarting camera");
    } else if (mode === "upload") {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        console.log("[OCRScanner] Reset file input");
      }
    }
  };

  // 🔄 Switch Mode
  const handleModeSwitch = (newMode) => {
    console.log("[OCRScanner] 📱 Switching mode from", mode, "to", newMode);
    stopAll();
    setMode(newMode);
    setResult(null);
    setCameraError(null);
  };

  // 🎥 Start Camera with permission check
  useEffect(() => {
    if (mode !== "camera") {
      console.log("[OCRScanner] Mode is not camera, skipping startup");
      return;
    }

    console.log("[OCRScanner] 📷 Camera mode activated");

    const startCamera = async () => {
      try {
        console.log("[OCRScanner] Requesting camera permission...");
        
        // ✅ Request camera permission first (for mobile)
        const permissionResult = await requestCameraPermission();
        if (!permissionResult.success) {
          console.error("[OCRScanner] Camera permission denied:", permissionResult);
          
          const errorMsg = permissionResult.message || "Camera permission denied";
          setCameraError({
            type: permissionResult.errorType,
            message: errorMsg,
            details: permissionResult.errorDetails,
          });
          setIsRetryable(permissionResult.errorType !== "insecure_origin" && permissionResult.errorType !== "no_api");
          
          setResult({ 
            found: false, 
            error: errorMsg,
          });
          return;
        }

        console.log("[OCRScanner] ✅ Camera permission granted, requesting stream...");

        // Get camera stream
        const streamResult = await getCameraStream({ 
          facingMode: "environment",
          timeout: 5000,
          debug: true 
        });

        if (!streamResult.success) {
          console.error("[OCRScanner] Failed to get camera stream:", streamResult);
          
          setCameraError({
            type: streamResult.errorType,
            message: streamResult.userMessage,
            details: streamResult.errorDetails,
          });
          setIsRetryable(streamResult.isRetryable);
          
          setResult({ 
            found: false, 
            error: streamResult.userMessage,
          });
          return;
        }

        console.log("[OCRScanner] ✅ Camera stream acquired successfully");

        if (videoRef.current) {
          videoRef.current.srcObject = streamResult.stream;
          streamRef.current = streamResult.stream;
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            console.log("[OCRScanner] 📹 Video metadata loaded");
            setCameraReady(true);
            setCameraError(null);
            startAutoScan(); // 🚀 start auto scanning
          };
        }
      } catch (err) {
        console.error("[OCRScanner] Camera startup error:", err.name, err.message);
        
        let errorType = "unknown";
        let errorMsg = "Camera access failed. Please try again.";
        let retryable = true;

        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorType = "permission_denied";
          errorMsg = "❌ Camera permission denied. Please enable camera in browser settings.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorType = "no_camera";
          errorMsg = "❌ No camera found on this device. Try uploading an image instead.";
          retryable = false;
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorType = "camera_in_use";
          errorMsg = "⚠️ Camera is already in use. Close other apps and try again.";
        } else if (err.name === "OverconstrainedError" || err.name === "ConstraintError") {
          errorType = "constraint_error";
          errorMsg = "⚠️ Camera configuration error. Your device may not support required settings.";
        }

        setCameraError({
          type: errorType,
          message: errorMsg,
          details: err.message,
        });
        setIsRetryable(retryable);

        setResult({ 
          found: false, 
          error: errorMsg,
        });
      }
    };

    startCamera();

    return () => {
      console.log("[OCRScanner] 🧹 Camera effect cleanup");
      stopAll();
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F0FDFA] via-[#F8FAFB] to-[#ECFDF5] p-4 text-slate-900">
      {/* ❌ Close Button */}
      <button
        onClick={() => {
          console.log("[OCRScanner] Closing");
          stopAll();
          onClose();
        }}
        className="absolute right-4 top-4 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-800 shadow-sm transition-all hover:bg-teal-50"
        title="Close scanner"
      >
        ✕
      </button>

      {/* 📱 Mode Selector */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button
          onClick={() => handleModeSwitch("camera")}
          className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] ${
            mode === "camera"
              ? "bg-gradient-to-r from-teal-700 to-teal-500 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-teal-50"
          }`}
          title="Switch to camera mode"
        >
          📷
        </button>

        <button
          onClick={() => handleModeSwitch("upload")}
          className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] ${
            mode === "upload"
              ? "bg-gradient-to-r from-teal-700 to-teal-500 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-teal-50"
          }`}
          title="Switch to upload mode"
        >
          📁
        </button>
      </div>

      {/* 🎥 Camera Mode */}
      {mode === "camera" && (
        <div className="relative flex h-full w-full max-w-5xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-950 shadow-2xl">
          {!cameraError && !result ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* 🔍 Status Overlay */}
              {cameraReady && (
                <div className="camera-overlay absolute bottom-20 rounded-lg bg-black/70 px-6 py-3 text-center font-medium text-white sm:bottom-10">
                  {loading ? "🔍 Scanning..." : "📷 Point camera at medicine label"}
                </div>
              )}

              {/* Loading State */}
              {!cameraReady && !cameraError && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center">
                    <div className="camera-overlay mb-4 animate-spin text-white">
                      <div className="text-4xl">📷</div>
                    </div>
                    <p className="camera-overlay font-medium text-white">Initializing camera...</p>
                  </div>
                </div>
              )}
            </>
          ) : null}

          {/* ⚠️ Camera Error */}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-4">
              <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
                <p className="text-4xl mb-4">{getErrorMessage(cameraError.type).icon}</p>
                <h3 className="text-xl font-bold text-white mb-2">
                  {getErrorMessage(cameraError.type).title}
                </h3>
                <p className="mb-4 text-sm text-slate-600">
                  {getErrorMessage(cameraError.type).description}
                </p>
                
                {cameraError.details && (
                  <p className="mb-4 rounded bg-slate-50 p-2 text-xs text-slate-600">
                    {cameraError.details}
                  </p>
                )}

                {/* 🔧 Troubleshooting */}
                <div className="mb-4 max-h-40 overflow-y-auto rounded border border-slate-100 bg-slate-50 p-3 text-left text-sm text-slate-600">
                  <p className="font-semibold mb-2">💡 Troubleshooting:</p>
                  {cameraError.type === "permission_denied" && (
                    <ul className="space-y-1 text-xs">
                      <li>• Check if you denied camera permission</li>
                      <li>• Go to browser settings → Privacy → Camera</li>
                      <li>• Allow camera for this website</li>
                      <li>• Refresh the page after changing settings</li>
                    </ul>
                  )}
                  {cameraError.type === "camera_in_use" && (
                    <ul className="space-y-1 text-xs">
                      <li>• Close other apps using the camera</li>
                      <li>• Close other browser tabs</li>
                      <li>• Close video conferencing apps</li>
                      <li>• Restart your browser</li>
                    </ul>
                  )}
                  {cameraError.type === "no_camera" && (
                    <ul className="space-y-1 text-xs">
                      <li>• Connect an external camera</li>
                      <li>• Check device camera is enabled</li>
                      <li>• Use upload mode instead</li>
                    </ul>
                  )}
                  {cameraError.type === "insecure_origin" && (
                    <ul className="space-y-1 text-xs">
                      <li>• Use HTTPS connection</li>
                      <li>• Or use localhost</li>
                      <li>• ngrok doesn't work for camera</li>
                    </ul>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {isRetryable && (
                    <button
                      onClick={handleRetry}
                      className="min-h-[44px] rounded-lg bg-amber-100 px-6 py-3 font-medium text-amber-800 transition-all hover:bg-amber-200"
                    >
                      🔄 Retry Camera
                    </button>
                  )}
                  <button
                    onClick={() => handleModeSwitch("upload")}
                    className="min-h-[44px] rounded-lg bg-gradient-to-r from-teal-700 to-teal-500 px-6 py-3 font-medium text-white transition-all hover:brightness-105"
                  >
                    📁 Upload Image Instead
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📁 Upload Mode */}
      {mode === "upload" && (
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-sm">
          <div className="text-center text-slate-900">
            <p className="text-2xl sm:text-3xl font-bold mb-2">📁 Upload Medicine Image</p>
            <p className="text-sm text-slate-600">Take a photo of the medicine box or bottle label</p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="min-h-[44px] w-full rounded-lg bg-gradient-to-r from-teal-700 to-teal-500 px-8 py-4 text-lg font-medium text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            title="Click to select an image"
          >
            {loading ? "🔍 Processing..." : "📸 Choose Image"}
          </button>

          {/* 🔍 Status */}
          {loading && (
            <div className="rounded-xl border border-teal-100 bg-white px-6 py-4 text-center text-slate-800 shadow-sm">
              <p className="text-base font-medium">🔍 Scanning image...</p>
              <p className="mt-2 text-sm text-slate-600">This may take a few seconds</p>
            </div>
          )}
        </div>
      )}

      {/* 📊 Result */}
      {result && !loading && (
        <div className="absolute bottom-20 left-4 right-4 mx-auto max-h-[60vh] max-w-sm overflow-y-auto rounded-2xl border border-teal-100 bg-white p-6 text-slate-900 shadow-xl sm:bottom-10">
          {result.found ? (
            // ✅ FOUND IN DATABASE
            <div>
              <p className="font-bold text-lg mb-3">✅ Medicine Found!</p>
              <div className="mb-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
                <p className="font-semibold">{result.medicine?.name}</p>
                {result.medicine?.brand && (
                  <p className="text-gray-300">Brand: {result.medicine.brand}</p>
                )}
                {result.medicine?.dosage && (
                  <p className="text-gray-300">Dosage: {result.medicine.dosage}</p>
                )}
              </div>
              <button
                onClick={() => {
                  stopAll();
                  onResult(result.medicine);
                }}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all min-h-[44px]"
              >
                ✅ Use This Medicine
              </button>
            </div>
          ) : result.error ? (
            // ❌ ERROR
            <div>
              <p className="font-bold text-lg mb-2">❌ Error</p>
              <p className="mb-4 text-sm text-slate-600">{result.error}</p>
              <button
                onClick={handleRetry}
                className="min-h-[44px] w-full rounded-lg bg-amber-100 px-4 py-3 font-medium text-amber-800 transition-all hover:bg-amber-200"
              >
                🔄 Try Again
              </button>
            </div>
          ) : result.extracted ? (
            // ⚠️ NOT FOUND BUT EXTRACTED
            <div>
              <p className="font-bold text-lg mb-3">⚠️ Medicine Not Found in Database</p>
              <p className="mb-3 text-sm text-slate-600">But I extracted this information:</p>
              <div className="mb-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
                <p className="font-semibold">{result.extracted.name}</p>
                {result.extracted.brand && (
                  <p className="text-gray-300">{result.extracted.brand}</p>
                )}
                {result.extracted.dosage && (
                  <p className="text-gray-300">{result.extracted.dosage}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUseExtracted}
                  className="min-h-[44px] flex-1 rounded-lg bg-green-100 px-3 py-3 font-medium text-green-800 transition-all hover:bg-green-200"
                >
                  ✅ Use This
                </button>
                <button
                  onClick={handleRetry}
                  className="min-h-[44px] flex-1 rounded-lg bg-amber-100 px-3 py-3 font-medium text-amber-800 transition-all hover:bg-amber-200"
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default OCRScanner;