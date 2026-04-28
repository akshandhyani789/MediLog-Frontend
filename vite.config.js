import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import os from "os";

// ✅ Get local IP address for mobile access
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const LOCAL_IP = getLocalIP();
const PORT = 5173;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // ✅ Expose to all network interfaces
    host: "0.0.0.0",
    port: PORT,
    strictPort: false,

    // ✅ Allow requests from network
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      LOCAL_IP,
      "*.local",
    ],

    // ✅ Print network information on startup
    middlewareMode: false,
  },

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },

  // ✅ Environment variables for mobile detection
  define: {
    __LOCAL_IP__: JSON.stringify(LOCAL_IP),
    __PORT__: JSON.stringify(PORT),
  },
});

// ✅ Print network access info
console.log("\n╔════════════════════════════════════════╗");
console.log("║  🚀 MediLog Dev Server Started       ║");
console.log("╠════════════════════════════════════════╣");
console.log(`║  Local:    http://localhost:${PORT}        ║`);
console.log(`║  Network:  http://${LOCAL_IP}:${PORT}       ║`);
console.log("║                                        ║");
console.log("║  📱 Use Network URL on mobile device  ║");
console.log("╚════════════════════════════════════════╝\n");