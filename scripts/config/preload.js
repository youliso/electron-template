const { resolve } = require('path');
const { external, plugins } = require('./base');

module.exports = {
  input: resolve('src/preload/index.ts'),
  output: {
    file: resolve('dist/preload/index.js'),
    format: 'cjs',
    sourcemap: false
  },
  external,
  plugins
};
