import { spawn } from 'node:child_process';
import { rspack } from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';

import * as rspackConfig from './rspack.config.mjs';

let electronProcess = null;
let manualRestart = false;

async function startRenderer() {
  let port = 0;
  try {
    port = (await import('./.env.json', { assert: { type: 'json' } })).default['process.env.PORT'];
  } catch (e) {
    throw 'not found process.env.PORT';
  }
  const server = new RspackDevServer(
    { port, host: 'localhost', hot: true },
    rspack(rspackConfig.rendererConfig(true))
  );
  await server.start();
}

async function startMain() {
  return new Promise((resolve, reject) => {
    const watcher = rspack([rspackConfig.mainConfig(true), rspackConfig.preloadConfig(true)]);
    watcher.watch(
      {
        aggregateTimeout: 300,
        poll: undefined
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          reject(1);
          return;
        }
        if (electronProcess && electronProcess.kill) {
          manualRestart = true;
          process.kill(electronProcess.pid);
          electronProcess = null;
          startElectron();
          setTimeout(() => {
            manualRestart = false;
          }, 5000);
        }
        resolve(0);
      }
    );
  });
}

async function startElectron() {
  let args = ['dist/index.js'];
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }
  electronProcess = spawn((await import('electron')).default, args);
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
