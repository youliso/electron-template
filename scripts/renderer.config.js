const { defineConfig } = require('vite');
const { resolve } = require('path');
const root = resolve('src/renderer');
const outDir = resolve('dist/renderer');

// https://vitejs.dev/config/
module.exports = (env) => {
  return defineConfig({
    root,
    base: './',
    esbuild: {
      jsxInject: `import {h,f} from '@/renderer/common/h'`,
      jsxFactory: 'h',
      jsxFragment: 'f'
    },
    build: {
      outDir,
      emptyOutDir: false
    },
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: []
  });
};
