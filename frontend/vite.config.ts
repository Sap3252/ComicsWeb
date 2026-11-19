import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api se reenvía al backend, igual que el rewrite de Render: así la cookie de sesión es del mismo origen
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' }
  }
});
