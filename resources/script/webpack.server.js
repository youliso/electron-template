const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const renderer = require('./webpack.renderer.config'); //子进程
const cfg = require('./cfg.json');

renderer.plugins.push(new CleanWebpackPlugin()); //清除dist
module.exports = {
    ...renderer,
    devServer: {
        contentBase: path.resolve("dist"),
        port: cfg.port
    }
};
