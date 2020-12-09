const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const {spawn} = require('child_process');
const electron = require('electron');
const path = require('path');
const cfg = require('./cfg.json');

let electronProcess = null;

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
    const config = require('./webpack.main.config');
    const compiler = webpack(config);
    compiler.watch({}, (err, stats) => {
        if (err) {
            console.log(err);
            return
        }
        if (electronProcess) {
            electronProcess.kill()
            electronProcess = null;
            startElectron();
        } else {
            startElectron();
        }
    });
}

function startElectron() {
    const args = [
        "dist/main.bundle.js",
    ];
    electronProcess = spawn(electron, args);
    electronProcess.stdout.on("data", data => console.log("[main:stdout]", data.toString()));
    electronProcess.stderr.on("data", data => console.log("[main:stderr]", data.toString()))
    electronProcess.on("close", (e) => {
        if (e === 0) startElectron();
    });
}

async function init() {
    await startRenderer();
    await startMain();
}

init().then();