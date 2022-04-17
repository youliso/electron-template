const { resolve } = require('path');
const { external, plugins } = require('./base');

module.exports = {
  input: resolve('src/main/index.ts'),
  output: {
    file: resolve('dist/main/index.js'),
    format: 'cjs',
    sourcemap: false
  },
  external,
  plugins
};
