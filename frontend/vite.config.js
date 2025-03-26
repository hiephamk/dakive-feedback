import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Ensure Vite listens on all interfaces
    port: 5173,  
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://backend:8000', // Uses backend inside Docker
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
