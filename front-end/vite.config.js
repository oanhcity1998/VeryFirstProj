import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/VeryFirstProj/",
  server: {
    host: "0.0.0.0", // mở cho toàn mạng
    port: 5173, // hoặc port bạn muốn
    allowedHosts: [
      "ae835acfb7d3.ngrok-free.app", // 👈 thêm domain ngrok của bạn
    ],
  },
});
