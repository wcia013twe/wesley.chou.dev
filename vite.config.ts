import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
      "jsm": "three/examples/jsm",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three':  ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-motion': ['motion'],
          'vendor-gsap':   ['gsap'],
        },
      },
    },
  },
  server: {
    port: 5173,
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
      port: 5173,
    },
  },
});