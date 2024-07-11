const { resolve } = require('path');
const { builtinModules } = require('module');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const image = require('@rollup/plugin-image');
const replace = require('@rollup/plugin-replace').default;
const esbuild = require('rollup-plugin-esbuild').default;
const { dependencies } = require('../package.json');

let external = [...builtinModules, 'electron'];

for (const i in dependencies) external.push(i);

const plugins = (env) => [
  nodeResolve({
    preferBuiltins: true,
    browser: false,
    extensions: ['.mjs', '.ts', '.js', '.json', '.node']
  }),
  commonjs({
    sourceMap: false
  }),
  json(),
  image(),
  alias({
    entries: [{ find: '@', replacement: resolve('src') }]
  }),
  esbuild({
    include: /\.[jt]s?$/,
    exclude: /node_modules/,
    sourceMap: false,
    minify: env !== 'development',
    target: 'esnext',
    define: {
      __VERSION__: '"x.y.z"'
    },
    loaders: {
      '.json': 'json',
      '.ts': 'ts'
    }
  }),
  replace({
    preventAssignment: true,
    values: require('./.env.json')
  })
];

module.exports = {
  mainOptions: (env) => ({
    input: resolve('src/main/index.ts'),
    output: {
      file: resolve('dist/index.js'),
      format: 'cjs',
      sourcemap: false,
      inlineDynamicImports: true
    },
    external,
    plugins: plugins(env)
  }),
  preloadOptions: (env) => ({
    input: resolve('src/preload/index.ts'),
    output: {
      file: resolve('dist/preload.js'),
      format: 'cjs',
      sourcemap: false
    },
    external,
    plugins: plugins(env)
  })
};
