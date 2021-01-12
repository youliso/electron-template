const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const {spawn} = require('child_process');
const electron = require('electron');
const path = require('path');
const cfg = require('./cfg.json');

let electronProcess = null;
let manualRestart = false


async function startRenderer() {
    const config = require('./webpack.renderer.config');
    const options = {
        contentBase: path.resolve("dist"),
        hot: true,
        host: 'localhost'
    };
    webpackDevServer.addDevServerEntrypoints(config, options);
    const compiler = webpack(config);
    const server = new webpackDevServer(compiler, options);
    server.listen(cfg.port, 'localhost', () => {
        console.log(`dev server listening on port ${cfg.port}`);
    });
}

async function startMain() {
    return new Promise((resolve) => {
        const config = require('./webpack.main.config');
        const compiler = webpack(config);
        compiler.watch({}, (err, stats) => {
            if (err) {
                console.log(err);
                return
            }
            if (electronProcess && electronProcess.kill) {
                manualRestart = true
                process.kill(electronProcess.pid)
                electronProcess = null
                startElectron()
                setTimeout(() => {
                    manualRestart = false
                }, 5000)
            }
            resolve(1);
        });
    })
}

function startElectron() {
    let args = [
        "dist/main.bundle.js",
    ];
    if (process.env.npm_execpath.endsWith('yarn.js')) {
        args = args.concat(process.argv.slice(3))
    } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args = args.concat(process.argv.slice(2))
    }
    electronProcess = spawn(electron, args);
    electronProcess.stdout.on("data", data => console.log("[main:stdout]", data.toString()));
    electronProcess.stderr.on("data", data => console.log("[main:stderr]", data.toString()))
    electronProcess.on('exit', (e) => {
        console.log(e)
    })
    electronProcess.on('close', () => {
        if (!manualRestart) process.exit();
    })
}

async function init() {
    await startRenderer();
    await startMain();
    startElectron();
}

init().then();