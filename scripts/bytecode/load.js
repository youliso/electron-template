'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const v8 = require('v8');
const Module = require('module');
v8.setFlagsFromString('--no-lazy');
v8.setFlagsFromString('--no-flush-bytecode');
const FLAG_HASH_OFFSET = 12;
const SOURCE_HASH_OFFSET = 8;
let dummyBytecode;
function setFlagHashHeader(bytecodeBuffer) {
  if (!dummyBytecode) {
    const script = new vm.Script('', { produceCachedData: true });
    dummyBytecode = script.createCachedData();
  }
  dummyBytecode
    .slice(FLAG_HASH_OFFSET, FLAG_HASH_OFFSET + 4)
    .copy(bytecodeBuffer, FLAG_HASH_OFFSET);
}
function getSourceHashHeader(bytecodeBuffer) {
  return bytecodeBuffer.slice(SOURCE_HASH_OFFSET, SOURCE_HASH_OFFSET + 4);
}
function buffer2Number(buffer) {
  let ret = 0;
  ret |= buffer[3] << 24;
  ret |= buffer[2] << 16;
  ret |= buffer[1] << 8;
  ret |= buffer[0];
  return ret;
}
Module._extensions['.bin'] = function (module, filename) {
  const bytecodeBuffer = fs.readFileSync(filename);
  if (!Buffer.isBuffer(bytecodeBuffer)) {
    throw new Error('BytecodeBuffer must be a buffer object.');
  }
  setFlagHashHeader(bytecodeBuffer);
  const length = buffer2Number(getSourceHashHeader(bytecodeBuffer));
  let dummyCode = '';
  if (length > 1) {
    dummyCode = '"' + '\u200b'.repeat(length - 2) + '"';
  }
  const script = new vm.Script(dummyCode, {
    //创建vm.Script对象
    filename: filename,
    lineOffset: 0,
    displayErrors: true,
    cachedData: bytecodeBuffer
  });
  if (script.cachedDataRejected) {
    throw new Error('Invalid or incompatible cached data (cachedDataRejected)');
  }
  const require = function (id) {
    return module.require(id);
  };
  require.resolve = function (request, options) {
    return Module._resolveFilename(request, module, false, options);
  };
  if (process.mainModule) {
    require.main = process.mainModule;
  }
  require.extensions = Module._extensions;
  require.cache = Module._cache;
  const compiledWrapper = script.runInThisContext({
    //创建执行对象
    filename: filename,
    lineOffset: 0,
    columnOffset: 0,
    displayErrors: true
  });
  const dirname = path.dirname(filename);
  const args = [module.exports, require, module, filename, dirname, process, global];
  return compiledWrapper.apply(module.exports, args); //执行代码
};
