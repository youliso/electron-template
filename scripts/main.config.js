const { resolve } = require('path');
const { builtinModules } = require('module');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const image = require('@rollup/plugin-image');
const obfuscator = require('rollup-plugin-obfuscator').default;
const esbuild = require('rollup-plugin-esbuild').default;
const { dependencies } = require('../package.json');

let external = [...builtinModules, 'electron'];

for (const i in dependencies) external.push(i);

let plugins = [
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
    minify: process.env['mainMode'] !== 'development',
    target: 'esnext',
    define: {
      __VERSION__: '"x.y.z"'
    },
    loaders: {
      '.json': 'json',
      '.ts': 'ts'
    }
  })
];

process.env['mainMode'] !== 'development' && plugins.push(obfuscator({}));

module.exports = [
  {
    input: resolve('src/main/index.ts'),
    output: {
      file: resolve('dist/main/index.js'),
      format: 'cjs',
      sourcemap: false
    },
    external,
    plugins
  },
  {
    input: resolve('src/main/preload/index.ts'),
    output: {
      file: resolve('dist/main/preload.js'),
      format: 'cjs',
      sourcemap: false
    },
    external,
    plugins
  }
];
