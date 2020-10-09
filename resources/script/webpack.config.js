const webpack = require("webpack");
const fs = require('fs');
const path = require('path');
const main = require('./webpack.main.config'); //主进程
const renderer = require('./webpack.renderer.config'); //子进程
deleteFolderRecursive(path.resolve('dist'));//清除dist
webpack([
    {...main},
    {...renderer}
], (err, stats) => {
    if (err || stats.hasErrors()) {
        // 在这里处理错误
        throw err;
    }
    console.log('ok')
});
/**
 *
 * @param {*} url
 */
function deleteFolderRecursive(url) {
    let files = [];
    /**
     * 判断给定的路径是否存在
     */
    if (fs.existsSync(url)) {
        /**
         * 返回文件和子目录的数组
         */
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {

            let curPath = path.join(url, file);
            /**
             * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
             */
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);

            } else {
                fs.unlinkSync(curPath);
            }
        });
        /**
         * 清除文件夹
         */
        fs.rmdirSync(url);
    } else {
        console.log("...");
    }
}
