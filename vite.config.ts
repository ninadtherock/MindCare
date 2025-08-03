import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Force HTTP instead of HTTPS for local development
    https: false,
    // Ensure proper host configuration
    host: true,
    port: 5173
  }
});