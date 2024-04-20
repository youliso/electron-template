const bytecode = require('./bytecode');
const { asar } = require('./build.json');

exports.default = async (context) => {
  if (!asar) {
    //v8字节码
    await bytecode();
  }
};
