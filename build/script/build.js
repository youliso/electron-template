const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const webpack = require('webpack');
const config = require('../cfg/build.json');
const main = require('./webpack.main.config'); //主进程
const renderer = require('./webpack.renderer.config'); //子进程
let [, , arch] = process.argv;

if (!arch) {
  console.log('你要构建哪个平台的应用?');
  console.log('可传入参数：win|win32|win64|winp|winp32|winp64|darwin|mac|linux');
  return;
}
arch = arch.trim();

function deleteFolderRecursive(url) {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      let curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(url);
  }
}

config.extraResources = [
  {
    from: 'resources/extern',
    to: 'extern/',
    filter: ['**/*']
  }
];
let archTag = '';
let archPath = '';
switch (arch) {
  case 'win':
  case 'win32':
  case 'win64':
  case 'winp':
  case 'winp32':
  case 'winp64':
    archTag = 'win';
    archPath = 'platform/win32';
    if (arch.startsWith('win')) {
      let bv = {
        target: 'nsis',
        arch: null
      };
      if (arch.length === 3) bv.arch = ['x64', 'ia32'];
      else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
      else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
      config.win.target = [bv];
    }
    if (arch.startsWith('winp')) {
      let bv = {
        target: 'portable',
        arch: null
      };
      if (arch.length === 4) bv.arch = ['x64', 'ia32'];
      else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
      else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
      config.win.target = [bv];
    }
    break;
  case 'darwin':
  case 'mac':
    archTag = 'mac';
    archPath = 'platform/darwin';
    break;
  case 'linux':
    archTag = 'linux';
    archPath = 'platform/linux';
    break;
}

try {
  fs.accessSync(path.resolve('./resources/' + archPath));
  config.extraResources.push({
    from: 'resources/' + archPath,
    to: archPath,
    filter: ['**/*']
  });
} catch (err) {}
fs.writeFileSync('./build/cfg/build.json', JSON.stringify(config, null, 2));

deleteFolderRecursive(path.resolve('dist')); //清除dist
webpack([{ ...main('production') }, { ...renderer('production') }], (err, stats) => {
  if (err || stats.hasErrors()) throw err;
  exec(
    `electron-builder -c build/cfg/build.json --${archTag}`,
    {
      cwd: path.resolve()
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(stdout);
      console.log(stderr);
    }
  );
});
