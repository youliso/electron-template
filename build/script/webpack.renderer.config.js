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
    ...base,
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
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loader: {
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        },
        {
          test: /\.ts$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'esnext'
            // appendTsSuffixTo: [/\.vue$/]
          },
          exclude: /node_modules/
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
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
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
