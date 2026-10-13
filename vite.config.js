import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: {target:'es2022', rollupOptions:{input:{site:'index.html',admin:'admin/index.html'}}},
  server: {
    proxy: {
      '/sitemap.xml': 'http://127.0.0.1:5174',
      '/robots.txt': 'http://127.0.0.1:5174',
      '/api': 'http://127.0.0.1:5174',
      '/assets': 'http://127.0.0.1:5174',
    },
  },
});
