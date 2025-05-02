import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this define section to handle environment variables
  define: {
    // Replace all instances of process.env with this object
    "process.env": JSON.stringify({
      NODE_ENV: "production",
      // Add any other environment variables your code might need
      // If you're using WS_BACKEND_URL in your code:
      WS_BACKEND_URL: "http://localhost:4000",
    }),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["iife"], // Immediately Invoked Function Expression - makes it embeddable
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Global variables to use in the IIFE for externalized deps
        globals: {},
      },
    },
  },
});
