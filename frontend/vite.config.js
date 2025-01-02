
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Ensure the port is set correctly (or change if needed)
    open: true,  // This will automatically open the browser when the server starts
  }
});
