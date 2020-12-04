const path = require('path');
const renderer = require('./webpack.renderer.config'); //子进程
const cfg = require('./cfg.json');

module.exports = {
    ...renderer,
    devServer: {
        contentBase: path.resolve("dist"),
        hot: true,
        port: cfg.port
    }
};
