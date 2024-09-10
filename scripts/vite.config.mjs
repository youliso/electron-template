import { defineConfig } from 'vite';
import { resolve } from 'path';
const root = resolve('src/renderer');
const outDir = resolve('dist');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root,
  base: './',
  resolve: {
    alias: { '@': resolve('src') }
  },
  esbuild: {
    legalComments: 'none',
    drop: mode === 'development' ? [] : ['debugger', 'console']
  },
  build: {
    outDir,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          let chunkAlias = void 0;
          if (id.includes('node_modules')) {
            const name = id.split('node_modules/')[1].split('/');
            chunkAlias = name[0] === '.pnpm' ? name[1] : name[0];
          }
          return chunkAlias;
        },
        chunkFileNames: 'static/script/[name]-[hash].js',
        entryFileNames: 'static/script/[name]-[hash].js',
        assetFileNames: 'static/asset/[name]-[hash].[ext]'
      }
    }
  },
  define: {
    ...require('./.env.json')
  },
  plugins: []
}));
