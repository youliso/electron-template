const { defineConfig } = require('vite');
const { resolve } = require('path');
const root = resolve('src/renderer');
const outDir = resolve('dist/renderer');

// https://vitejs.dev/config/
module.exports = defineConfig({
  mode: process.env['rendererMode'] || 'production',
  root,
  base: './',
  esbuild: {
    jsxInject: `import {h,f} from '@/renderer/common/h'`,
    jsxFactory: 'h',
    jsxFragment: 'f'
  },
  build: {
    outDir,
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild'
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
});
