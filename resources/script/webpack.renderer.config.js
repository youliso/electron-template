const path = require('path');
const webpack = require("webpack");
const {name} = require('../../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _externals = require('externals-dependencies');

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';
module.exports = {
    devtool: isEnvDevelopment ? 'source-map' : false,
    mode: isEnvProduction ? 'production' : 'development',
    target: "electron-renderer",
    externals: _externals(),
    entry: {
        app: ['./src/views/app.tsx']
    },
    output: {
        filename: '[name].bundle.view.js',
        chunkFilename: '[id].bundle.view.js',
        path: path.resolve('dist'),
        library: 'IReact',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
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
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: name,
            template: "./resources/script/index.html"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })

    ],
};
