import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
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
