const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';
module.exports = {
    devtool: isEnvDevelopment ? 'source-map' : false,
    mode: isEnvProduction ? 'production' : 'development',
    target: "electron-main",
    entry: './src/lib/main.ts',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve('dist')
    },
    node: {
        __filename: false,
        __dirname: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve('src/lib/static'),
                    to: path.resolve('dist/static')
                }
            ]
        })
    ]
};
