import { defineConfig } from 'vite';

export default defineConfig({

  // Configuracion de servidor
  server: {
    port: 5173,
    strictPort: true,
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },

  base: '/FSM/',
});