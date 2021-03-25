const { resolve } = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const base = require('./webpack.base.config')
module.exports = (env) => {
  return {
    ...base,
    mode: env,
    target: 'electron-main',
    entry: {
      main: './src/main/index.ts'
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[id].bundle.js',
      path: resolve('dist')
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'esnext'
          },
          exclude: /node_modules/
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    optimization: {
      minimize: env === 'production',
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'esnext'
        })
      ]
    },
    plugins: []
  };
};