import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: '../../public/calculator', emptyOutDir: true },
  test: { globals: true, environment: 'jsdom', setupFiles: ['./tests/setup.ts'] },
})
