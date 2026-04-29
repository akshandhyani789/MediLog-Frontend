/**
 * Dynamic API Base URL Detection
 * Supports local development, network access, and production deployments
 */

export function getAPIBaseURL() {
  const host = window.location.hostname;

  // Local development
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  // Production
  return import.meta.env.VITE_API_URL || 
    "https://medilog-backend-dc01.onrender.com/api";
}
export function isNetworkAccess() {
  const host = window.location.hostname;
  return host !== "localhost" && host !== "127.0.0.1";
}

export function getNetworkInfo() {
  return {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port,
    apiBaseURL: getAPIBaseURL(),
    isNetworkAccess: isNetworkAccess(),
  };
}