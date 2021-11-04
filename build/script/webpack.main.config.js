const { resolve } = require('path');
const base = require('./webpack.base.config');

module.exports = (env) => {
  return {
    ...base,
    mode: env,
    devtool: env === 'production' ? undefined : base.devtool,
    target: 'electron-main',
    entry: {
      main: './src/main/index.ts',
      preload: './src/main/preload/index.ts'
    },
    output: {
      filename: './js/[name].js',
      chunkFilename: './js/[id].js',
      path: resolve('dist')
    },
    optimization: {
      minimize: env === 'production'
    }
  };
};
