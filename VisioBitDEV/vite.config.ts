import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  // Wichtig für Single-File Inlining
  base: './', 
  plugins: [
    react(),
    nodePolyfills(),
    viteSingleFile() // Packt alles in die HTML Datei
  ],
  build: {
    target: "es2020", // Kompatibilität sicherstellen
    cssCodeSplit: false, // CSS nicht splitten, sondern inlinen
    assetsInlineLimit: 100000000, // Alles inlinen (100MB Limit)
    rollupOptions: {
      output: {
        manualChunks: undefined, // Kein Chunking, alles in eins
      },
    },
    chunkSizeWarningLimit: 3000,
    outDir: 'dist',
  }
})