/**
 * 📷 Camera Helper Utility
 * Centralized camera access and management
 * Handles secure origins, permissions, and comprehensive error handling
 */

// ✅ Check if on secure origin (required for camera access)
export function isSecureOrigin() {
  const isHttps = window.location.protocol === 'https:';
  const hostname = window.location.hostname;
  
  // ✅ Localhost/127.0.0.1 always allowed
  const isLocalhost = hostname === 'localhost' || 
                     hostname === '127.0.0.1' ||
                     hostname === '[::1]' ||
                     hostname === '::1';
  
  // ✅ Local network IPs allowed (for mobile testing on same network)
  const isLocalNetwork = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+$/.test(hostname);
  
  // ✅ Allow: HTTPS anywhere, or HTTP on localhost/local network
  return isHttps || isLocalhost || isLocalNetwork;
}

// 📝 Error type descriptions
const ERROR_TYPES = {
  permission_denied: {
    title: "📷 Camera Permission Denied",
    description: "Please enable camera access in your browser settings.",
    icon: "❌",
    retryable: true,
  },
  no_camera: {
    title: "❌ No Camera Found",
    description: "No camera device detected on this device.",
    icon: "📵",
    retryable: false,
  },
  camera_in_use: {
    title: "📷 Camera In Use",
    description: "Camera is already being used by another app. Please close other apps and try again.",
    icon: "⚠️",
    retryable: true,
  },
  constraint_error: {
    title: "📷 Camera Configuration Error",
    description: "Your device doesn't support the required camera settings.",
    icon: "⚙️",
    retryable: true,
  },
  insecure_origin: {
    title: "🔒 Secure Connection Required",
    description: "Camera requires HTTPS, localhost, or local network IP (192.168.x.x). ngrok tunnels don't work.",
    icon: "🔐",
    retryable: false,
  },
  no_api: {
    title: "⚠️ Browser Not Supported",
    description: "Your browser doesn't support camera access.",
    icon: "🚫",
    retryable: false,
  },
  type_error: {
    title: "⚠️ Browser Not Supported",
    description: "Your browser doesn't support camera access.",
    icon: "🚫",
    retryable: false,
  },
  security_error: {
    title: "🔒 Security Error",
    description: "Camera access is blocked. Please use HTTPS or localhost.",
    icon: "🔐",
    retryable: false,
  },
  aborted: {
    title: "⏸️ Access Cancelled",
    description: "Camera access was cancelled or timed out.",
    icon: "⏱️",
    retryable: true,
  },
  unknown: {
    title: "❌ Camera Error",
    description: "An unknown error occurred.",
    icon: "⚠️",
    retryable: true,
  },
};

/**
 * 📷 Request camera stream with comprehensive error handling
 * @returns {Object} { success, stream, error, errorType, userMessage }
 */
export async function getCameraStream(options = {}) {
  const {
    facingMode = "environment",
    timeout = 5000,
    debug = true,
  } = options;

  const debugLog = (level, message, data = {}) => {
    if (debug) {
      console.log(`[Camera ${level}] ${message}`, data);
    }
  };

  try {
    // 🔒 Check secure origin first
    if (!isSecureOrigin()) {
      debugLog("⚠️", "Not on secure origin");
      return {
        success: false,
        stream: null,
        error: "Not on secure origin",
        errorType: "insecure_origin",
        userMessage: ERROR_TYPES.insecure_origin.description,
        isRetryable: ERROR_TYPES.insecure_origin.retryable,
      };
    }

    // ✅ Check if getUserMedia is available
    if (!navigator.mediaDevices?.getUserMedia) {
      debugLog("⚠️", "getUserMedia API not available");
      return {
        success: false,
        stream: null,
        error: "getUserMedia API not available",
        errorType: "no_api",
        userMessage: ERROR_TYPES.no_api.description,
        isRetryable: ERROR_TYPES.no_api.retryable,
      };
    }

    debugLog("📷", "Requesting camera access", { facingMode, timeout });

    // ⏱️ Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
        },
        audio: false,
      });

      clearTimeout(timeoutId);
      debugLog("✅", "Camera stream acquired successfully");

      return {
        success: true,
        stream,
        error: null,
        errorType: null,
        userMessage: "Camera ready",
        isRetryable: false,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    debugLog("❌", "Camera access failed", { name: error.name, message: error.message });

    // Categorize the error
    let errorType = "unknown";
    
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      errorType = "permission_denied";
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      errorType = "no_camera";
    } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      errorType = "camera_in_use";
    } else if (error.name === "OverconstrainedError" || error.name === "ConstraintError") {
      errorType = "constraint_error";
    } else if (error.name === "TypeError") {
      errorType = "type_error";
    } else if (error.name === "AbortError") {
      errorType = "aborted";
    } else if (error.name === "SecurityError") {
      errorType = "security_error";
    }

    const errorInfo = ERROR_TYPES[errorType] || ERROR_TYPES.unknown;

    return {
      success: false,
      stream: null,
      error: error.message,
      errorType,
      userMessage: errorInfo.description,
      isRetryable: errorInfo.retryable,
      errorDetails: {
        name: error.name,
        message: error.message,
      },
    };
  }
}

/**
 * 🛑 Safely stop camera stream
 */
export function stopCameraStream(stream) {
  if (stream && stream.getTracks) {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
        console.log("[Camera] 🛑 Stopped track:", track.kind);
      } catch (err) {
        console.warn("[Camera] Warning stopping track:", err.message);
      }
    });
  }
}

/**
 * 🔄 Get error display info for UI
 */
export function getErrorDisplay(errorType) {
  return ERROR_TYPES[errorType] || ERROR_TYPES.unknown;
}

/**
 * 📊 Log camera capabilities
 */
export async function debugCameraCapabilities() {
  try {
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log("[Camera] enumerateDevices not available");
      return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");

    console.log("[Camera] Available video devices:", videoDevices.length);
    videoDevices.forEach((device, index) => {
      console.log(`  [${index}] ${device.label || "Unknown"} (${device.deviceId.substring(0, 8)}...)`);
    });
  } catch (err) {
    console.warn("[Camera] Error enumerating devices:", err.message);
  }
}

/**
 * 🔔 Get user-friendly error message
 */
export function getErrorMessage(errorType, errorDetails = {}) {
  const errorInfo = ERROR_TYPES[errorType] || ERROR_TYPES.unknown;
  return {
    title: errorInfo.title,
    description: errorInfo.description,
    icon: errorInfo.icon,
    isRetryable: errorInfo.retryable,
  };
}

/**
 * ✅ Initialize camera debugging on app load
 */
export function initCameraDebugging() {
  const hostname = window.location.hostname;
  const isHttps = window.location.protocol === 'https:';
  const isLocalhost = hostname === 'localhost' || 
                     hostname === '127.0.0.1' ||
                     hostname === '[::1]' ||
                     hostname === '::1';
  const isLocalNetwork = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+$/.test(hostname);
  
  console.log("[Camera] 🎥 Camera System Initialized");
  console.log("[Camera] 🔒 Secure origin:", isSecureOrigin());
  console.log("[Camera] 📱 Protocol:", window.location.protocol);
  console.log("[Camera] 🌐 Hostname:", window.location.hostname);
  console.log("[Camera] ✅ HTTPS:", isHttps);
  console.log("[Camera] ✅ Localhost:", isLocalhost);
  console.log("[Camera] ✅ Local Network:", isLocalNetwork);
  
  if (navigator.mediaDevices?.ondevicechange) {
    console.log("[Camera] 🔔 Device change listener available");
    navigator.mediaDevices.addEventListener("devicechange", () => {
      console.log("[Camera] 🔄 Camera devices changed");
      debugCameraCapabilities();
    });
  }

  // Initial device check
  debugCameraCapabilities();
}
