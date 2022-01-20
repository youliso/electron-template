const { resolve } = require('path');
const { productName } = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.config');

module.exports = (env) => {
  let config = {
    experiments: base.experiments,
    node: {
      ...base.node
    },
    mode: env,
    devtool: env === 'production' ? undefined : base.devtool,
    target: 'web',
    entry: {
      app: './src/renderer/index.ts'
    },
    output: {
      filename: './js/[name].v.js',
      chunkFilename: './js/[id].v.js',
      path: resolve('dist')
    },
    resolve: base.resolve,
    module: {
      rules: [
        ...base.module.rules,
        {
          test: /\.(sa|sc|c)ss$/i,
          exclude: /\.lazy\.(sa|sc|c)ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.lazy\.(sa|sc|c)ss$/i,
          use: [
            { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: productName,
        template: './resources/build/index.html'
      })
    ],
    optimization: {
      minimize: env === 'production'
    }
  };

  return config;
};
