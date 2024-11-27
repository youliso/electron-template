const vm = require('node:vm');
const v8 = require('node:v8');
const wrap = require('node:module').wrap;
v8.setFlagsFromString('--no-lazy');
v8.setFlagsFromString('--no-flush-bytecode');

let code = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
  const data = process.stdin.read();
  if (data !== null) {
    code += data;
  }
});
process.stdin.on('end', () => {
  try {
    const script = new vm.Script(wrap(code), { produceCachedData: true });
    const bytecodeBuffer = script.createCachedData();
    process.stdout.write(bytecodeBuffer.map((b) => b ^ process.env['DecodeNumber']));
  } catch (error) {
    console.error(error);
  }
});
