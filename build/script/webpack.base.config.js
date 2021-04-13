const { resolve } = require('path');

module.exports = {
  experiments: {
    // topLevelAwait: true,
  },
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
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
          target: 'esnext'
        }
      },
      {
        test: /\.(png|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
    ]
  }
};