const fs = require('fs');
const readline = require('readline');
const path = require('path');
const rollup = require('rollup');
const vite = require('vite');
const builder = require('electron-builder');
const buildConfig = require('../resources/build/cfg/build.json');
const mainOptions = require('./main.config');
const rendererOptions = require('./renderer.config');

let [, , arch, _notP] = process.argv;

const optional = ['win', 'win32', 'win64', 'winp', 'winp32', 'winp64', 'darwin', 'mac', 'linux'];
const notP_optional = '-notp';

const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

buildConfig.afterPack = 'scripts/buildAfterPack.js';

buildConfig.extraResources = [
  {
    from: 'resources/extern',
    to: 'extern/',
    filter: ['**/*']
  }
];

function checkInput(str) {
  if (optional.indexOf(str) === -1) {
    console.log(`\x1B[31mIllegal input , Please check input \x1B[0m`);
    r.close();
    return false;
  }
  return true;
}

async function mainBuild() {
  for (const opt of mainOptions) {
    await rollup
      .rollup(opt)
      .then(async (build) => await build.write(opt.output))
      .catch((error) => {
        console.log(`\x1B[31mFailed to build main process !\x1B[0m`);
        console.error(error);
        process.exit(1);
      });
  }
}

async function rendererBuild() {
  await vite.build(rendererOptions).catch((error) => {
    console.log(`\x1B[31mFailed to build renderer process !\x1B[0m`);
    console.error(error);
    process.exit(1);
  });
}

async function core(arch) {
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
      archTag = builder.Platform.WINDOWS.createTarget();
      archPath = 'platform/win32';
      if (arch.startsWith('win')) {
        let bv = {
          target: 'nsis',
          arch: null
        };
        if (arch.length === 3) bv.arch = ['x64', 'ia32'];
        else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
        else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
        buildConfig.win.target = [bv];
      }
      if (arch.startsWith('winp')) {
        let bv = {
          target: 'portable',
          arch: null
        };
        if (arch.length === 4) bv.arch = ['x64', 'ia32'];
        else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
        else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
        buildConfig.win.target = [bv];
      }
      break;
    case 'darwin':
    case 'mac':
      archTag = builder.Platform.MAC.createTarget();
      archPath = 'platform/darwin';
      break;
    case 'linux':
      archTag = builder.Platform.LINUX.createTarget();
      archPath = 'platform/linux';
      break;
  }
  try {
    fs.accessSync(path.resolve('./resources/' + archPath));
    buildConfig.extraResources.push({
      from: 'resources/' + archPath,
      to: archPath,
      filter: ['**/*']
    });
  } catch (err) {}
  fs.writeFileSync('./resources/build/cfg/build.json', JSON.stringify(buildConfig, null, 2)); //写入配置
  deleteFolderRecursive(path.resolve('dist')); //清除dist
  console.log('\x1B[34m[build start]\x1B[0m');
  await mainBuild();
  await rendererBuild();
  builder
    .build({
      targets: archTag,
      config: buildConfig
    })
    .then(() => {
      console.log('\x1B[32m[build success] \x1B[0m');
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      process.exit();
    });
}

if (!arch) {
  console.log('\x1B[36mWhich platform is you want to build?\x1B[0m');
  console.log(
    `optional：\x1B[33m${optional}\x1B[0m  \x1B[1mor\x1B[0m  \x1B[33mq\x1B[0m \x1B[1m(exit)\x1B[0m  \x1B[2m|\x1B[0m  [\x1B[36m${notP_optional}\x1B[0m]  `
  );
  r.on('line', (str) => {
    let strs = str.split(' ').filter((s) => s !== '');
    if (strs[0] === 'q') {
      console.log(`\x1B[32mExit success\x1B[0m`);
      r.close();
      return;
    }
    if (strs[1] && strs[1] === notP_optional) delete buildConfig.afterPack;
    if (!checkInput(strs[0])) return;
    r.close();
    core(strs[0]);
  });
} else {
  if (_notP) delete buildConfig.afterPack;
  if (checkInput(arch)) core(arch);
}
