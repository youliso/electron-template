const rollup = require('rollup');
const { resolve } = require('path');
const { spawn } = require('child_process');
const electron = require('electron');
const { mainOptions, preloadOptions } = require('./rollup.config');

let electronProcess = null;
let manualRestart = false;

async function startRenderer() {
  let port = 0;
  try {
    port = require('./.env.json')['process.env.PORT'];
  } catch (e) {
    throw 'not found process.env.PORT';
  }
  const server = await (
    await import('vite')
  ).createServer({
    configFile: resolve('scripts/vite.config.mjs')
  });
  await server.listen(port);
}

async function startMain() {
  return new Promise((resolve, reject) => {
    const watcher = rollup.watch([mainOptions('development'), preloadOptions('development')]);
    watcher.on('event', (event) => {
      if (event.code === 'END') {
        if (electronProcess && electronProcess.kill) {
          manualRestart = true;
          process.kill(electronProcess.pid);
          electronProcess = null;
          startElectron();
          setTimeout(() => {
            manualRestart = false;
          }, 5000);
        }
        resolve(1);
      } else if (event.code === 'ERROR') {
        reject(event.error);
      }
    });
  });
}

function startElectron() {
  let args = ['--inspect', 'dist/index.js'];
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }
  electronProcess = spawn(electron, args);
  electronProcess.stdout.on('data', (data) => onLog('info', data));
  electronProcess.stderr.on('data', (data) => onLog('err', data));
  electronProcess.on('exit', (e) => {
    console.log('[main exit]');
  });
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}

function onLog(type, data) {
  let color = type === 'err' ? '31m' : '34m';
  const dataStr = data.toString(); // 将Buffer转换为字符串
  dataStr.split(/\r?\n/).forEach((line) => {
    if (line) {
      console.log(
        `\x1b[${color}[main ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1;${type === 'err' ? color : '1m'}${line}\x1b[0m`
      );
    }
  });
}

startRenderer().then(() => {
  console.time('dev');
  startMain().then(() => {
    startElectron();
    console.timeEnd('dev');
  });
});
