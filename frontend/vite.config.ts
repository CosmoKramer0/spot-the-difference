import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          react: ['react', 'react-dom', 'react-router-dom'],
          zustand: ['zustand'],
          forms: ['react-hook-form']
        }
      }
    },
    // Optimize for production
    minify: true,
    // Enable source maps for debugging
    sourcemap: true,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  // Optimize dev server
  server: {
    port: 5173,
    host: true // Allow external connections
  },
  // Optimize preview
  preview: {
    port: 4173,
    host: true
  },
  // PWA and asset optimization
  assetsInclude: ['**/*.woff', '**/*.woff2']
})
