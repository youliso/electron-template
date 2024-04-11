const bytecode = require('./bytecode');

exports.default = async (context) => {
  //v8字节码
  await bytecode();
};
