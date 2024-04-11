const compile = require('./compile');
const external = require('./external');
const { readFileSync, writeFileSync } = require('fs');

module.exports = async () => {
  let code = readFileSync('dist/main/index.js', 'utf8');
  const codeData = await compile(external(code));
  writeFileSync('dist/main/index.bin', codeData);
  writeFileSync('dist/main/index.js', `'use strict';require('./load.js');require('./index.bin');`);
  writeFileSync('dist/main/load.js', readFileSync('scripts/bytecode/load.js', 'utf8'));
  console.log(`  \x1B[34m•\x1B[0m byteCode applying  \x1B[34m\x1B[0m`);
};
