const { resolve } = require('path');
const { name } = require('../../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const base = require('./webpack.base.config');
module.exports = (env) => {
  return {
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
      filename: './js/[name]v.js',
      chunkFilename: './js/[id]v.js',
      path: resolve('dist')
    },
    resolve: {
      ...base.resolve
    },
    module: {
      rules: [
        ...base.module.rules,
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: miniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: miniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new miniCssExtractPlugin({
        filename: './css/[name].css',
        chunkFilename: './css/[id].css'
      }),
      new HtmlWebpackPlugin({
        title: name,
        template: './build/index.html'
      }),
      new VueLoaderPlugin()
    ],
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
