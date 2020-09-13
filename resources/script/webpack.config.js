const webpack = require("webpack");

const main = require('./webpack.main.config'); //主进程
const renderer = require('./webpack.renderer.config'); //子进程

webpack([
    {...main},
    {...renderer}
], (err, stats) => {
    if (err || stats.hasErrors()) {
        // 在这里处理错误
        throw err;
    }
    console.log(stats)
});
