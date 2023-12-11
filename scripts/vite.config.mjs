import { defineConfig } from 'vite';
import macrosPlugin from 'vite-plugin-babel-macros';
import { resolve } from 'path';
const root = resolve('src/renderer');
const outDir = resolve('dist/renderer');

// https://vitejs.dev/config/
export default defineConfig({
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
