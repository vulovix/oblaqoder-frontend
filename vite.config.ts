import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~/": path.resolve(__dirname, "src") + "/", // force trailing slash
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:6001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
