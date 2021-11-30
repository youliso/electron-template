const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline')
const webpack = require('webpack');
const config = require('../cfg/build.json');
const main = require('./webpack.main.config'); //主进程
const renderer = require('./webpack.renderer.config'); //子进程
let [, , arch] = process.argv;

const optional = ['win', 'win32', 'win64', 'winp', 'winp32', 'winp64', 'darwin', 'mac', 'linux']

const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

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

function core(arch) {
  arch = arch.trim();
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
  } catch (err) {
    console.info(`[warn archPath ${archPath}]`, err);
  }
  fs.writeFileSync('./build/cfg/build.json', JSON.stringify(config, null, 2));//写入配置
  deleteFolderRecursive(path.resolve('dist')); //清除dist
  webpack([{ ...main('production') }, { ...renderer('production') }], (err, stats) => {
    if (err || stats.hasErrors()) throw err;
    console.log(`electron-builder -c build/cfg/build.json --${archTag}`);
    const s = setInterval(() => {
      console.log('building...');
    }, 5000)
    const c = exec(
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
    c.once('close', () => {
      clearInterval(s)
      r.close()
    })
  });
}


if (!arch) {
  console.log('Which platform is you want to build?');
  console.log(`optional：${optional}    q exit`);
  r.on('line', (str) => {
    if (str === "q") {
      console.log('exit success');
      r.close()
      return
    }
    if (optional.indexOf(str) === -1) {
      console.log('illegal input');
      r.close()
      return
    }
    r.pause()
    core(str)
  })
} else {
  core(arch)
}
