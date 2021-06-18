const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const main = require('./webpack.main.config'); //主进程
const renderer = require('./webpack.renderer.config'); //子进程

function deleteFolderRecursive(url) {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function(file, index) {
      let curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(url);
  } else {
    console.log('...');
  }
}

deleteFolderRecursive(path.resolve('dist')); //清除dist
webpack([{ ...main('production') }, { ...renderer('production') }], (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
    throw err;
  }
  console.log('ok');
});
