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
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
      {/* ❌ Close Button */}
      <button
        onClick={() => {
          console.log("[OCRScanner] Closing");
          stopAll();
          onClose();
        }}
        className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center z-10"
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
              ? "bg-blue-500 text-white"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
          title="Switch to camera mode"
        >
          📷
        </button>

        <button
          onClick={() => handleModeSwitch("upload")}
          className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] ${
            mode === "upload"
              ? "bg-blue-500 text-white"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
          title="Switch to upload mode"
        >
          📁
        </button>
      </div>

      {/* 🎥 Camera Mode */}
      {mode === "camera" && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
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
                <div className="absolute bottom-20 sm:bottom-10 text-white text-center bg-black/70 px-6 py-3 rounded-lg font-medium">
                  {loading ? "🔍 Scanning..." : "📷 Point camera at medicine label"}
                </div>
              )}

              {/* Loading State */}
              {!cameraReady && !cameraError && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin text-white mb-4">
                      <div className="text-4xl">📷</div>
                    </div>
                    <p className="text-white font-medium">Initializing camera...</p>
                  </div>
                </div>
              )}
            </>
          ) : null}

          {/* ⚠️ Camera Error */}
          {cameraError && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-sm text-center">
                <p className="text-4xl mb-4">{getErrorMessage(cameraError.type).icon}</p>
                <h3 className="text-xl font-bold text-white mb-2">
                  {getErrorMessage(cameraError.type).title}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {getErrorMessage(cameraError.type).description}
                </p>
                
                {cameraError.details && (
                  <p className="text-xs text-gray-400 mb-4 bg-gray-800 p-2 rounded">
                    {cameraError.details}
                  </p>
                )}

                {/* 🔧 Troubleshooting */}
                <div className="mb-4 text-left bg-gray-800 p-3 rounded text-sm text-gray-300 max-h-40 overflow-y-auto">
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
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all min-h-[44px]"
                    >
                      🔄 Retry Camera
                    </button>
                  )}
                  <button
                    onClick={() => handleModeSwitch("upload")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all min-h-[44px]"
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
          <div className="text-white text-center">
            <p className="text-2xl sm:text-3xl font-bold mb-2">📁 Upload Medicine Image</p>
            <p className="text-gray-300 text-sm">Take a photo of the medicine box or bottle label</p>
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
            className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-lg font-medium transition-all min-h-[44px] w-full sm:w-auto"
            title="Click to select an image"
          >
            {loading ? "🔍 Processing..." : "📸 Choose Image"}
          </button>

          {/* 🔍 Status */}
          {loading && (
            <div className="text-white text-center bg-black/50 px-6 py-4 rounded-lg">
              <p className="text-base font-medium">🔍 Scanning image...</p>
              <p className="text-sm text-gray-300 mt-2">This may take a few seconds</p>
            </div>
          )}
        </div>
      )}

      {/* 📊 Result */}
      {result && !loading && (
        <div className="absolute bottom-20 sm:bottom-10 left-4 right-4 max-w-sm mx-auto bg-black/90 backdrop-blur-sm text-white p-6 rounded-lg border border-gray-600 max-h-[60vh] overflow-y-auto">
          {result.found ? (
            // ✅ FOUND IN DATABASE
            <div>
              <p className="font-bold text-lg mb-3">✅ Medicine Found!</p>
              <div className="space-y-2 text-sm bg-gray-900 p-3 rounded mb-4">
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
              <p className="text-sm text-gray-300 mb-4">{result.error}</p>
              <button
                onClick={handleRetry}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all min-h-[44px]"
              >
                🔄 Try Again
              </button>
            </div>
          ) : result.extracted ? (
            // ⚠️ NOT FOUND BUT EXTRACTED
            <div>
              <p className="font-bold text-lg mb-3">⚠️ Medicine Not Found in Database</p>
              <p className="text-sm text-gray-300 mb-3">But I extracted this information:</p>
              <div className="space-y-2 text-sm bg-gray-900 p-3 rounded mb-4">
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
                  className="flex-1 px-3 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all min-h-[44px]"
                >
                  ✅ Use This
                </button>
                <button
                  onClick={handleRetry}
                  className="flex-1 px-3 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all min-h-[44px]"
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