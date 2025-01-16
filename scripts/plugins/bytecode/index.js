const compile = require('./compile');
const external = require('./external');
const napiRsCode = require('./napi_rs_code');
const { spawn } = require('node:child_process');
const { readFileSync, writeFileSync, unlinkSync, renameSync } = require('node:fs');
const { Arch } = require('electron-builder');
const path = require('node:path');

const loadInit = () => {
  return new Promise((resolve) => {
    const loadProcess = spawn('npm', ['install'], {
      shell: true,
      cwd: path.resolve('scripts/plugins/bytecode/load')
    });
    loadProcess.stdout.on('data', (data) => {
      console.log(`  \x1B[34m•\x1B[0m byteCode Load ${data.toString('utf8').trim()}`);
    });
    loadProcess.stderr.on('data', (data) => {
      console.log(`  \x1B[34m•\x1B[0m byteCode Load ${data.toString('utf8').trim()}`);
    });
    loadProcess.on('close', (code) => {
      resolve(code);
    });
  });
};

const loadBuild = (electronPlatformName, arch) => {
  return new Promise((resolve) => {
    let opts = ['napi', 'build'];
    switch (electronPlatformName) {
      case 'win32':
        switch (arch) {
          case Arch.x64:
            opts.push('--target x86_64-pc-windows-gnu');
            break;
          case Arch.ia32:
            opts.push('--target i686-pc-windows-gnu');
            break;
        }
        break;
      case 'darwin':
        switch (arch) {
          case Arch.x64:
            opts.push('--target x86_64-apple-darwin');
            break;
          case Arch.arm64:
            opts.push('--target aarch64-apple-darwin');
            break;
        }
        break;
      case 'linux':
        switch (arch) {
          case Arch.x64:
            opts.push('--target x86_64-unknown-linux-gnu');
            break;
          case Arch.arm64:
            opts.push('--target aarch64-unknown-linux-gnu');
            break;
        }
        break;
    }
    opts.push('--release');
    const loadProcess = spawn('npx', opts, {
      shell: true,
      cwd: path.resolve('scripts/plugins/bytecode/load')
    });
    loadProcess.stdout.on('data', (data) => {
      console.log(`  \x1B[34m•\x1B[0m byteCode Load ${data.toString('utf8').trim()}`);
    });
    loadProcess.stderr.on('data', (data) => {
      console.log(`  \x1B[34m•\x1B[0m byteCode Load ${data.toString('utf8').trim()}`);
    });
    loadProcess.on('close', (code) => {
      resolve(code);
    });
  });
};

module.exports = async (electronPlatformName, arch) => {
  await loadInit();
  const DecodeNumber = Math.floor(Math.random() * 256);
  const napiCode = napiRsCode(DecodeNumber);
  writeFileSync('scripts/plugins/bytecode/load/src/lib.rs', napiCode);
  let code = readFileSync('dist/index.js', 'utf8');
  const codeData = await compile(external(code), DecodeNumber);
  writeFileSync('dist/index.bin', codeData);
  await loadBuild(electronPlatformName, arch);
  unlinkSync('dist/index.bin');
  renameSync('scripts/plugins/bytecode/load/index.node', 'dist/index.node');
  writeFileSync(
    'dist/index.js',
    `try {require("./index.node").load(module, require);} catch (error) {console.error(error);process.exit(1);}`
  );
  console.log(`  \x1B[34m•\x1B[0m byteCode applying  \x1B[34m\x1B[0m`);
};
