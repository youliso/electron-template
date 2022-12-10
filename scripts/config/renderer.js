const { defineConfig } = require('vite');
const macrosPlugin = require('vite-plugin-babel-macros').default;
const { resolve } = require('path');
const root = resolve('src/renderer');
const outDir = resolve('dist/renderer');

// https://vitejs.dev/config/
module.exports = defineConfig({
  mode: process.env['rendererMode'] || 'production',
  root,
  base: './',
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react'
      }
    },
    jsxInject: `import {h,f} from '@youliso/granule'`,
    jsxFactory: 'h',
    jsxFragment: 'f'
  },
  build: {
    outDir
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  plugins: [macrosPlugin()]
});
