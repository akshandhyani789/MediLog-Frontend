/**
 * Dynamic API Base URL Detection
 * Supports local development, network access, and production deployments
 */

export function getAPIBaseURL() {
  const isLocal = window.location.hostname === "localhost";

  if (isLocal) {
    return "http://localhost:5000";
  }

  // production backend (Render)
  return "https://medilog-backend-dc01.onrender.com";
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