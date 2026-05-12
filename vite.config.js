import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    // Increase chunk warning limit — base64 images make bundle large
    chunkSizeWarningLimit: 4096,
  },
  // If deploying to a subdirectory, change base here; "/" is fine for Vercel root
  base: "/",
});
