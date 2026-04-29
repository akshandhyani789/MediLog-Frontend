/**
 * Dynamic API Base URL Detection
 * Supports local development, network access, and production deployments
 */

export function getAPIBaseURL() {
  const host = window.location.hostname;
  const protocol = window.location.protocol;

  // ✅ Local development
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  // ✅ Network/Mobile access (same IP/domain, different port)
  if (host.includes(".")) {
    // Local IP address detected
    return `${protocol}//${host}:5000/api`;
  }

  // ✅ Production deployment (Vercel frontend → Render backend)
  // Using environment variable set during build or fallback to Render URL
  const prodBackendURL =
    import.meta.env.VITE_API_URL ||
    "https://medilog-backend-1482.onrender.com/api";

  return prodBackendURL;
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