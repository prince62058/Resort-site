import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Preserve the browser's Host so admin Origin checks work through the dev proxy.
const backend = { target: 'http://127.0.0.1:5174', changeOrigin: false };
export default defineConfig({
  plugins: [react()],
  build: {target:'es2022', rollupOptions:{input:{site:'index.html',admin:'admin/index.html'}}},
  server: {
    proxy: {
      '/sitemap.xml': { ...backend },
      '/robots.txt': { ...backend },
      '/api': { ...backend },
      '/assets': { ...backend },
    },
  },
});
