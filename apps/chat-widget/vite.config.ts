import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
