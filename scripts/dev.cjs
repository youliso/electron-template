const { spawn } = require('node:child_process');
const { rspack } = require('@rspack/core');
const { RspackDevServer } = require('@rspack/dev-server');
const electron = require('electron');
const { buildConfig } = require('./buildCfg.cjs');
const rspackConfig = require('./rspack.config.cjs');


let electronProcess = null;
let manualRestart = false;

async function startRenderer(envConfig) {
  const port = envConfig['process.env.PORT'];
  const server = new RspackDevServer(
    { port, host: 'localhost', hot: true },
    rspack(rspackConfig.rendererConfig(true, envConfig))
  );
  await server.start();
}

async function startMain(envConfig) {
  return new Promise((resolve, reject) => {
    const watcher = rspack([rspackConfig.mainConfig(true, envConfig), rspackConfig.preloadConfig(true, envConfig)]);
    watcher.watch(
      {
        aggregateTimeout: 300,
        poll: undefined
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          console.error(err?.stack || err);
          if (err?.details) {
            console.error(err.details);
          } else {
            console.error(stats.toString());
          }
          throw new Error('Error occured in main process');
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

const start = async () => {
  console.time('dev');
  const { envConfig } = await buildConfig(`platform/${process.platform}`);
  await startRenderer(envConfig).catch(console.error);
  await startMain(envConfig).catch(console.error);
  await startElectron().catch(console.error);
  console.timeEnd('dev');
}

start();