import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4400',
        changeOrigin: true,
      },
      // Forward font requests to the Express server. Without this, Vite's SPA
      // fallback returns index.html for /preview-fonts/* and the iframe fonts
      // silently 404.
      '/preview-fonts': {
        target: 'http://localhost:4400',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'client-dist',
    emptyOutDir: true,
  },
});
