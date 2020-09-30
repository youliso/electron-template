const path = require('path');
const webpack = require("webpack");
const {name} = require('../../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _externals = require('externals-dependencies');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';
module.exports = {
    devtool: isEnvDevelopment ? 'source-map' : false,
    mode: isEnvProduction ? 'production' : 'development',
    target: "electron-renderer",
    externals: _externals(),
    entry: {
        app: './src/views/index.ts'
    },
    output: {
        filename: '[name].bundle.view.js',
        chunkFilename: '[id].bundle.view.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: 'svelte-loader'
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: miniCssExtractPlugin.loader,
                    options: {
                        // you can specify a publicPath here
                        // by default it use publicPath in webpackOptions.output
                        publicPath: '../'
                    }
                },
                    "css-loader"
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
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        extensions: ['.tsx', '.ts', '.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new miniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new OptimizeCssAssetsPlugin(),
        new HtmlWebpackPlugin({
            title: name,
            template: "./resources/script/index.html"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
};
