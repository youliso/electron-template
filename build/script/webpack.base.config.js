const { resolve } = require('path');

module.exports = {
  node: {
    global: false,
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'dist': resolve('dist'),
      '@': resolve('src')
    }
  }
};