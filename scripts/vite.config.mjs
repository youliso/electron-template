import { defineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import { resolve } from 'path';
const root = resolve('src/renderer');
const outDir = resolve('dist/renderer');

// https://vitejs.dev/config/
export default defineConfig({
  root,
  base: './',
  build: {
    outDir
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  plugins: [vuePlugin()]
});
