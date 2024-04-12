const compile = require('./compile');
const external = require('./external');
const { spawn } = require('child_process');
const { readFileSync, writeFileSync, unlinkSync, renameSync } = require('fs');
const path = require('path');

const loadBuild = () => {
  return new Promise((resolve) => {
    const loadProcess = spawn('npx', ['napi', 'build', '--release'], {
      shell: true,
      cwd: path.resolve('scripts/bytecode/load')
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
  let code = readFileSync('dist/main/index.js', 'utf8');
  const codeData = await compile(external(code));
  writeFileSync('dist/main/index.bin', codeData);
  await loadBuild();
  unlinkSync('dist/main/index.bin');
  renameSync('scripts/bytecode/load/index.node', 'dist/main/index.node');
  writeFileSync('dist/main/index.js', `require("./index.node").load(module, require);`);
  console.log(`  \x1B[34m•\x1B[0m byteCode applying  \x1B[34m\x1B[0m`);
};
