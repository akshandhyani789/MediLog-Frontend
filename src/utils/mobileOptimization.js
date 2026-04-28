/**
 * ✅ Mobile Optimization Utilities
 * Handles responsive design, touch interactions, and mobile-specific optimizations
 */

/**
 * Tailwind breakpoints for responsive design
 * Use these in your components for consistent mobile-first design
 */
export const BREAKPOINTS = {
  xs: "320px",   // Extra small devices
  sm: "640px",   // Small devices (tablet)
  md: "768px",   // Medium devices
  lg: "1024px",  // Large devices
  xl: "1280px",  // Extra large devices
  "2xl": "1536px", // 2x large
};

/**
 * Utility function to check if device is mobile
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Utility function to get device orientation
 */
export function getDeviceOrientation() {
  return window.matchMedia("(orientation: portrait)").matches
    ? "portrait"
    : "landscape";
}

/**
 * Utility function to get screen size category
 */
export function getScreenSize() {
  const width = window.innerWidth;
  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  if (width < 1536) return "xl";
  return "2xl";
}

/**
 * Handle touch event with debounce to prevent multiple triggers
 * Useful for button clicks on mobile devices
 */
export function createTouchHandler(callback, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

/**
 * Optimize button tap targets for mobile
 * Returns Tailwind classes for touch-friendly sizing
 */
export function getTouchOptimizedButtonClasses() {
  return "min-h-[44px] min-w-[44px]"; // Apple's recommended 44x44px minimum
}

/**
 * Get responsive spacing based on screen size
 */
export function getResponsiveSpacing() {
  const screenSize = getScreenSize();
  const spacing = {
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
    "2xl": "p-8",
  };
  return spacing[screenSize] || "p-4";
}

/**
 * Get responsive font size
 */
export function getResponsiveFontSize() {
  const screenSize = getScreenSize();
  const fontSize = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };
  return fontSize[screenSize] || "text-base";
}

/**
 * Handle viewport meta tag for mobile devices
 * Call this in your main App component
 */
export function setupMobileViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
    );
  }
}

/**
 * 📷 Request permission for camera access (for barcode/OCR)
 * Handles all error scenarios with specific messages
 * Works on: localhost, HTTPS, or local network IPs
 */
export async function requestCameraPermission() {
  try {
    // 🔒 Check if on secure origin
    const hostname = window.location.hostname;
    const isHttps = window.location.protocol === 'https:';
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname === '[::1]' ||
                       hostname === '::1';
    const isLocalNetwork = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+$/.test(hostname);
    const isSecureOrigin = isHttps || isLocalhost || isLocalNetwork;
    
    if (!isSecureOrigin) {
      console.warn("[Camera] ⚠️ Not on secure origin. Camera access requires HTTPS, localhost, or local network IP");
      return {
        success: false,
        errorType: "insecure_origin",
        message: "Camera access requires HTTPS, localhost, or local network IP (192.168.x.x). ngrok doesn't work.",
      };
    }

    // ✅ Check if getUserMedia is available
    if (!navigator.mediaDevices?.getUserMedia) {
      console.warn("[Camera] ⚠️ getUserMedia API not available");
      return {
        success: false,
        errorType: "no_api",
        message: "Your browser doesn't support camera access.",
      };
    }

    console.log("[Camera] 📷 Requesting camera permission...");
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }, // Back camera for barcode scanning
      },
      audio: false,
    });

    // Stop the stream immediately after getting permission
    stream.getTracks().forEach((track) => {
      console.log("[Camera] 🛑 Stopping initial stream track:", track.kind);
      track.stop();
    });

    console.log("[Camera] ✅ Camera permission granted");
    return { 
      success: true, 
      errorType: null,
      message: "Camera permission granted" 
    };
  } catch (error) {
    console.error("[Camera] ❌ Camera permission error:", error.name, error.message);
    
    // Categorize the error
    let errorType = "unknown";
    let userMessage = "Camera access failed. Please try again.";

    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      errorType = "permission_denied";
      userMessage = "📷 Camera permission denied. Please enable camera access in your browser settings.";
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      errorType = "no_camera";
      userMessage = "❌ No camera found on this device. Please check your device setup.";
    } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      errorType = "camera_in_use";
      userMessage = "📷 Camera is already in use by another app. Please close other apps and try again.";
    } else if (error.name === "OverconstrainedError" || error.name === "ConstraintError") {
      errorType = "constraint_error";
      userMessage = "📷 Camera configuration error. Your device may not support the required camera settings.";
    } else if (error.name === "TypeError") {
      errorType = "type_error";
      userMessage = "📷 Camera access error. This usually means your browser doesn't support camera access.";
    } else if (error.name === "AbortError") {
      errorType = "aborted";
      userMessage = "📷 Camera access was cancelled or timed out. Please try again.";
    } else if (error.name === "SecurityError") {
      errorType = "security_error";
      userMessage = "🔒 Camera access is blocked for security reasons. Please use HTTPS or localhost.";
    }

    return {
      success: false,
      errorType,
      message: userMessage,
      errorDetails: error.message,
    };
  }
}

/**
 * Request permission for storage access
 */
export async function requestStoragePermission() {
  try {
    if ("permissions" in navigator) {
      const permission = await navigator.permissions.query({
        name: "storage",
      });
      return {
        success: true,
        status: permission.state,
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Storage permission error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Setup mobile-specific event listeners
 */
export function setupMobileEventListeners() {
  // Handle orientation change
  window.addEventListener("orientationchange", () => {
    console.log(
      "Device orientation:",
      getDeviceOrientation()
    );
  });

  // Handle visibility change (app goes to background/foreground)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.log("App moved to background");
    } else {
      console.log("App moved to foreground");
    }
  });
}

/**
 * Log mobile/network information for debugging
 */
export function logMobileInfo() {
  console.log("[Mobile Info]", {
    isMobile: isMobileDevice(),
    screenSize: getScreenSize(),
    orientation: getDeviceOrientation(),
    userAgent: navigator.userAgent,
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    devicePixelRatio: window.devicePixelRatio,
  });
}
