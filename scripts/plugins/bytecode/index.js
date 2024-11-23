const compile = require('./compile');
const external = require('./external');
const napiRsCode = require('./napi_rs_code');
const { spawn } = require('child_process');
const { readFileSync, writeFileSync, unlinkSync, renameSync } = require('fs');
const path = require('path');


const loadBuild = (arch) => {
  return new Promise((resolve) => {
    let opts = [' napi', ' build'];
    if (process.platform === 'win32') {
      if (arch === 'x64') {
        opts.push(' --target x86_64-pc-windows-msvc');
      } else if (arch === 'ia32') {
        opts.push(' --target i686-pc-windows-msvc');
      }
    }
    opts.push(' --release')
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

module.exports = async (arch) => {
  const DecodeNumber = Math.floor(Math.random() * 256);
  const napiCode = napiRsCode(DecodeNumber);
  writeFileSync('scripts/plugins/bytecode/load/src/lib.rs', napiCode);
  let code = readFileSync('dist/index.js', 'utf8');
  const codeData = await compile(external(code), DecodeNumber);
  writeFileSync('dist/index.bin', codeData);
  await loadBuild(arch);
  unlinkSync('dist/index.bin');
  renameSync('scripts/plugins/bytecode/load/index.node', 'dist/index.node');
  writeFileSync('dist/index.js', `try {require("./index.node").load(module, require);} catch (error) {console.error(error);process.exit(1);}`);
  console.log(`  \x1B[34m•\x1B[0m byteCode applying  \x1B[34m\x1B[0m`);
};
