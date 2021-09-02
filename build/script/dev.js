const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const electron = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let electronProcess = null;
let manualRestart = false;

async function startRenderer() {
  let port = 0;
  try {
    port = fs.readFileSync(path.resolve('.port'), 'utf8');
  } catch (e) {
    throw 'not found .port';
  }
  const config = require('./webpack.renderer.config')('development');
  const options = {
    host: 'localhost',
    port: port,
    hot: true,
    liveReload: false,
    static: path.resolve('dist')
  };
  const compiler = webpack(config);
  const server = new webpackDevServer(options, compiler);
  server.start();
}

async function startMain() {
  return new Promise((resolve) => {
    const compiler = webpack(require('./webpack.main.config')('development'));
    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
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
      resolve(1);
    });
  });
}

function startElectron() {
  let args = ['dist/js/main.js'];
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }
  electronProcess = spawn(electron, args);
  electronProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg)
      console.log(
        `\x1b[34m[main stdout ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1m${msg}\x1b[0m`
      );
  });
  electronProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg)
      console.log(
        `\x1b[31m[main stderr ${new Date().toLocaleTimeString()}]\x1b[0m: \x1b[1;31m${msg}\x1b[0m`
      );
  });
  electronProcess.on('exit', (e) => {
    console.log('exit', e);
  });
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}

async function init() {
  await startRenderer();
  await startMain();
  startElectron();
}

init().then();
