import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3123",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    port: 5173, // твой локальный порт
    strictPort: true,
    // Разрешаем хосты
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "https://a1332ded34aaff.lhr.life", // твой ngrok хост
    ],
  },
});
