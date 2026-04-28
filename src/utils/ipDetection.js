/**
 * ✅ Utility to detect local IP and determine API base URL
 * Handles both localhost and mobile network access
 */

/**
 * Get the API base URL based on the current location
 * On mobile: uses the local IP
 * On desktop/localhost: uses localhost
 */
export function getAPIBaseURL() {
  // Check if running via local IP (mobile access)
  const host = window.location.hostname;
  
  // If it's localhost or 127.0.0.1, use localhost for API
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000/api";
  }
  
  // Otherwise use the same host for API (mobile network access)
  // Assumes backend is on the same machine
  return `http://${host}:5000/api`;
}

/**
 * Get the local IP from environment variables (set by Vite config)
 */
export function getLocalIP() {
  return typeof __LOCAL_IP__ !== "undefined" ? __LOCAL_IP__ : "localhost";
}

/**
 * Get the dev server port from environment variables (set by Vite config)
 */
export function getDevPort() {
  return typeof __PORT__ !== "undefined" ? __PORT__ : "5173";
}

/**
 * Check if running on mobile/network
 */
export function isNetworkAccess() {
  const host = window.location.hostname;
  return host !== "localhost" && host !== "127.0.0.1";
}

/**
 * Get network information for debugging
 */
export function getNetworkInfo() {
  return {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port,
    apiBaseURL: getAPIBaseURL(),
    isNetworkAccess: isNetworkAccess(),
    localIP: getLocalIP(),
    devPort: getDevPort(),
  };
}

// ✅ Log network info in development
if (process.env.NODE_ENV === "development") {
  console.log("[Network Info]", getNetworkInfo());
}
