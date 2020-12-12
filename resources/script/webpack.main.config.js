const path = require("path");
const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";
const config = {
    mode: isEnvProduction ? "production" : "development",
    target: "electron-main",
    entry: {
        main: "./src/main/main.ts"
    },
    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js",
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
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [
                    "file-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "dist": path.resolve("dist"),
            "@": path.resolve("src")
        }
    },
    optimization: {
        minimize: true
    }
};
if (isEnvDevelopment) config.devtool = "source-map";
module.exports = config;