const { resolve } = require('path');

module.exports = {
  devtool: 'eval-cheap-source-map',
  node: {
    global: false,
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      dist: resolve('dist'),
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
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]'
        }
      }
    ]
  }
};
