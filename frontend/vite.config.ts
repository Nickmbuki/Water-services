import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 5173
  },
  preview: {
    allowedHosts: [
      "efficient-liberation-production.up.railway.app",
      "water-services-production.up.railway.app",
      ".up.railway.app"
    ]
  }
});
