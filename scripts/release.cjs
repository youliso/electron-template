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
};
const checkInput = (str) => {
  if (platformOptional().indexOf(str) === -1) {
    console.log(`\x1B[31mIllegal input , Please check input \x1B[0m`);
    r.close();
    return false;
  }
  return true;
};

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
  let resourcePaths = [];
  let archTarget = null;
  let targets;
  switch (arch) {
    case 'win':
    case 'win32':
    case 'win64':
    case 'winp':
    case 'winp32':
    case 'winp64':
      resourcePaths.push('platform/win32');
      targets = builder.Platform.WINDOWS.createTarget();
      let bv = {
        target: arch === 'winp' ? 'portable' : 'nsis',
        arch: null
      };
      if (arch.endsWith('32')) {
        bv.arch = ['ia32'];
        resourcePaths.push('platform/win32/ia32');
      } else if (arch.endsWith('64')) {
        bv.arch = ['x64'];
        resourcePaths.push('platform/win32/x64');
      } else {
        bv.arch = [process.arch];
        resourcePaths.push('platform/win32/' + process.arch);
      }
      archTarget = {
        target: 'win',
        value: [bv]
      };
      break;
    case 'darwin':
    case 'mac':
      resourcePaths.push('platform/darwin/' + process.arch);
      targets = builder.Platform.MAC.createTarget();
      break;
    case 'linux':
      resourcePaths.push('platform/linux/' + process.arch);
      targets = builder.Platform.LINUX.createTarget();
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
    default:
      console.log('\x1B[36mWhich platform is you want to build?\x1B[0m');
      console.log(
        ` optional：\x1B[33m${platformOptional()}\x1B[0m  \x1B[1mor\x1B[0m  \x1B[33mq\x1B[0m \x1B[1m(exit)\x1B[0m  \x1B[2m|\x1B[0m  `
      );
      process.exit(0);
  }

  const cfg = await buildConfig(resourcePaths, archTarget, true);
  await build(targets, cfg.envConfig, cfg.buildConfig);
};

if (!arch) {
  core(process.platform === 'win32' ? 'win' : process.platform);
} else {
  if (checkInput(arch)) core(arch);
}
