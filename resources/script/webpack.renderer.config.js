const path = require("path");
const webpack = require("webpack");
const {name} = require("../../package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const {VueLoaderPlugin} = require("vue-loader");
const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";
const config = {
    mode: isEnvProduction ? "production" : "development",
    target: "electron-renderer",
    entry: {
        app: "./src/renderer/index.ts"
    },
    output: {
        filename: "[name].bundle.view.js",
        chunkFilename: "[id].bundle.view.js",
        path: path.resolve("dist")
    },
    node: {
        global: false,
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loader: {
                        scss: "vue-style-loader!css-loader!sass-loader"
                    }
                }
            },
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {appendTsSuffixTo: [/\.vue$/]}
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
                        publicPath: "../"
                    }
                },
                    "css-loader"
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
                            publicPath: "../"
                        }
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [
                    "file-loader"
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    "file-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".vue", ".json"],
        alias: {
            "vue": "@vue/runtime-dom",
            "@": path.resolve("src")
        }
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
        new HtmlWebpackPlugin({
            title: name,
            template: "./resources/script/index.html"
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            "__VUE_OPTIONS_API__": "false",
            "__VUE_PROD_DEVTOOLS__": "false"
        })
    ]
};
if (isEnvDevelopment) config.devtool = "source-map";
module.exports = config;
