import { defineConfig } from 'vite';
import { resolve } from 'path';
const root = resolve('src/renderer');
const outDir = resolve('dist');

// https://vitejs.dev/config/
export default defineConfig({
  root,
  base: './',
  build: {
    emptyOutDir: false,
    outDir
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  plugins: []
});
