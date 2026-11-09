import path from "node:path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "@radix-ui/react-accordion"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
})
