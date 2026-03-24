// 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: "/", // ✅ for :contentReference[oaicite:0]{index=0}

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve('./src'), // ✅ FIXED (no __dirname)
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    host: true,
  }
});