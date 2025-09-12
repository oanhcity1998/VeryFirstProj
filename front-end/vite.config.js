import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // mở cho toàn mạng
    port: 5173,
    allowedHosts: [
      "ae835acfb7d3.ngrok-free.app", // domain ngrok của bạn
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 alias cho src
    },
  },
  envPrefix: 'VITE_',
});
