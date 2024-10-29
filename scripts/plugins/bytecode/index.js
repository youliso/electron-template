const compile = require('./compile');
const external = require('./external');
const napiRsCode = require('./napi_rs_code');
const { spawn } = require('child_process');
const { readFileSync, writeFileSync, unlinkSync, renameSync } = require('fs');
const path = require('path');


const loadBuild = () => {
  return new Promise((resolve) => {
    const loadProcess = spawn('npx', ['napi', 'build', '--release'], {
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

module.exports = async () => {
  const DecodeNumber = Math.floor(Math.random() * 256);
  const napiCode = napiRsCode(DecodeNumber);
  writeFileSync('scripts/plugins/bytecode/load/src/lib.rs', napiCode);
  let code = readFileSync('dist/index.js', 'utf8');
  const codeData = await compile(external(code), DecodeNumber);
  writeFileSync('dist/index.bin', codeData);
  await loadBuild();
  unlinkSync('dist/index.bin');
  renameSync('scripts/plugins/bytecode/load/index.node', 'dist/index.node');
  writeFileSync('dist/index.js', `require("./index.node").load(module, require);`);
  console.log(`  \x1B[34m•\x1B[0m byteCode applying  \x1B[34m\x1B[0m`);
};
