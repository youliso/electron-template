const { resolve } = require('path');
const webpack = require('webpack');
const { name } = require('../../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const base = require('./webpack.base.config');
module.exports = (env) => {
  return {
    node: {
      ...base.node
    },
    mode: env,
    target: 'web',
    entry: {
      app: './src/renderer/index.ts'
    },
    output: {
      filename: '[name].bundle.view.js',
      chunkFilename: '[id].bundle.view.js',
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
          use: [{
            loader: miniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: './'
            }
          },
            'css-loader'
          ]
        },
        {
          // scss
          test: /\.scss$/,
          use: [
            {
              loader: miniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it use publicPath in webpackOptions.output
                publicPath: './'
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
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({
        title: name,
        template: './build/index.html'
      }),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        '__VUE_OPTIONS_API__': 'false',
        '__VUE_PROD_DEVTOOLS__': 'false'
      })
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
