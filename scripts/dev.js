const rollup = require('rollup');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { spawn } = require('child_process');
const electron = require('electron');
const { mainOptions, preloadOptions } = require('./electronCfg');
let [, , type] = process.argv;

let electronProcess = null;
let manualRestart = false;

async function startRenderer() {
  let port = 0;
  try {
    port = readFileSync(resolve('.port'), 'utf8');
  } catch (e) {
    throw 'not found .port';
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
  let args = ['dist/main/index.js'];
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }
  electronProcess = spawn(electron, args);
  electronProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    msg &&
      console.log(
        `\x1b[34m[main stdout ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1m${msg}\x1b[0m`
      );
  });
  electronProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    msg &&
      console.log(
        `\x1b[31m[main stderr ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1;31m${msg}\x1b[0m`
      );
  });
  electronProcess.on('exit', (e) => {
    console.log('[main exit]');
  });
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}

async function init() {
  console.time(`dev ${type || ''}`);
  switch (type) {
    case 'web':
      await startRenderer();
      break;
    default:
      await startRenderer();
      await startMain();
      startElectron();
      break;
  }
  console.timeEnd(`dev ${type || ''}`);
}

init().then();
