const { resolve } = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
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
      filename: '[name].bundle.js',
      chunkFilename: '[id].bundle.js',
      path: resolve('dist')
    },
    optimization: {
      minimize: env === 'production',
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'esnext'
        })
      ]
    }
  };
};