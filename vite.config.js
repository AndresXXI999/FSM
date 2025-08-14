import { defineConfig } from 'vite';

export default defineConfig({
  // Directorio de nuestro codigo fuente
  root: 'src',

  // Configuracion de servidor
  server: {
    port: 5173,
    strictPort: true,
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});