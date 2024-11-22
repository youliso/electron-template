const readline = require('node:readline');
const builder = require('electron-builder');
const util = require('node:util');
const { build } = require('./build.cjs');
const { buildConfig } = require('./buildCfg.cjs');

let [, , arch, arg_opt] = process.argv;

const optional = ['win', 'win32', 'win64', 'winp', 'winp32', 'winp64', 'darwin', 'mac', 'linux'];
const linuxOptional = ['AppImage', 'flatpak', 'snap', 'deb', 'rpm', 'pacman'];
let pushLinuxOptional = false;

const platformOptional = () => {
  switch (process.platform) {
    case 'win32':
      return [...optional.filter((item) => item.startsWith('win'))];
    case 'linux':
      return [...optional.filter((item) => !(item === 'mac' || item === 'darwin'))];
    default:
      return [...optional];
  }
}
const checkInput = (str) => {
  if (platformOptional().indexOf(str) === -1) {
    console.log(`\x1B[31mIllegal input , Please check input \x1B[0m`);
    r.close();
    return false;
  }
  return true;
}



const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line) => {
    let cmds = platformOptional();
    pushLinuxOptional && (cmds = linuxOptional);
    !cmds.includes('q') && cmds.push('q');
    const hits = cmds.filter((c) => c.toLocaleLowerCase().startsWith(line.toLocaleLowerCase()));
    return [hits.length ? hits : cmds, line];
  }
});

const question = util.promisify(r.question).bind(r);
const core = async (arch) => {
  arch = arch.trim();
  let archPath = '';
  let archTarget = null;
  let targets;
  switch (arch) {
    case 'win':
    case 'win32':
    case 'win64':
    case 'winp':
    case 'winp32':
    case 'winp64':
      targets = builder.Platform.WINDOWS.createTarget();
      archPath = 'platform/win32';
      if (arch.startsWith('win')) {
        let bv = {
          target: 'nsis',
          arch: null
        };
        if (arch.length === 3) bv.arch = ['x64', 'ia32'];
        else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
        else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
        archTarget = {
          target: 'win',
          value: [bv]
        };
      } else if (arch.startsWith('winp')) {
        let bv = {
          target: 'portable',
          arch: null
        };
        if (arch.length === 4) bv.arch = ['x64', 'ia32'];
        else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
        else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
        archTarget = {
          target: 'win',
          value: [bv]
        };
      }
      break;
    case 'darwin':
    case 'mac':
      targets = builder.Platform.MAC.createTarget();
      archPath = 'platform/darwin';
      break;
    case 'linux':
      targets = builder.Platform.LINUX.createTarget();
      archPath = 'platform/linux';
      if (arg_opt) {
        archTarget = {
          target: 'linux',
          value: arg_opt
        };
      } else {
        pushLinuxOptional = true;
        let line = await question(
          '\x1B[36mPlease input linux package type:\x1B[0m \n optional：\x1B[33m' +
          linuxOptional +
          '\x1B[0m  \x1B[1mor\x1B[0m  \x1B[33mq\x1B[0m \x1B[1m(exit)\x1B[0m\n'
        );
        line = line.trim();
        if (line === 'q') {
          r.close();
          process.exit(0);
        }
        if (linuxOptional.indexOf(line) > -1) {
          archTarget = {
            target: 'linux',
            value: line
          };
        } else {
          console.log(`\x1B[31mIllegal input , Please check input \x1B[0m`);
          process.exit(0);
        }
      }
      break;
  }

  const cfg = await buildConfig(archPath, archTarget);
  await build(targets, cfg.envConfig, cfg.buildConfig);
}

if (!arch) {
  console.log('\x1B[36mWhich platform is you want to build?\x1B[0m');
  console.log(
    ` optional：\x1B[33m${platformOptional()}\x1B[0m  \x1B[1mor\x1B[0m  \x1B[33mq\x1B[0m \x1B[1m(exit)\x1B[0m  \x1B[2m|\x1B[0m  `
  );
  r.on('line', (str) => {
    let strs = str.split(' ').filter((s) => s !== '');
    if (strs.includes('q')) {
      console.log(`\x1B[32mExit success\x1B[0m`);
      r.close();
      return;
    }
    strs = strs.filter((x) => platformOptional().includes(x));
    if (!checkInput(strs[0])) return;
    core(strs[0]);
  });
} else {
  if (checkInput(arch)) core(arch);
}
