const fs = require('fs');
const readline = require('readline');
const path = require('path');
const rollup = require('rollup');
const vite = require('vite');
const builder = require('electron-builder');
const buildConfig = require('../resources/build/cfg/build.json');
const mainOptions = require('./main.config');
const rendererOptions = require('./renderer.config');

process.env['mainMode'] = 'production';
process.env['rendererMode'] = 'production';

let [, , arch] = process.argv;

const optional = ['win', 'win32', 'win64', 'winp', 'winp32', 'winp64', 'darwin', 'mac', 'linux'];

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

buildConfig.extraResources = [
  {
    from: 'resources/extern',
    to: 'extern/',
    filter: ['**/*']
  }
];

function checkInput(str) {
  if (optional.indexOf(str) === -1) {
    console.log('illegal input');
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
        console.log(`failed to build main process`);
        console.error(error);
        process.exit(1);
      });
  }
}

async function rendererBuild() {
  await vite.build(rendererOptions).catch((error) => {
    console.log(`failed to build renderer process`);
    console.error(error);
    process.exit(1);
  });
}

async function core(arch) {
  console.time('build');
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
  await mainBuild();
  console.log('[main success]');
  await rendererBuild();
  console.log('[renderer success]');
  builder
    .build({
      targets: archTag,
      config: buildConfig
    })
    .then(() => {
      console.log('[build success]');
      console.timeEnd('build');
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => r.close());
}

if (!arch) {
  console.log('Which platform is you want to build?');
  console.log(`optional：${optional}    q exit`);
  r.on('line', (str) => {
    if (str === 'q') {
      console.log('exit success');
      r.close();
      return;
    }
    if (!checkInput(str)) return;
    r.pause();
    core(str);
  });
} else {
  if (checkInput(arch)) core(arch);
}
