const bytecode = require('./plugins/bytecode');
const { asar } = require('./.build.json');

exports.default = async () => {
  try {
    if (!asar) {
      //v8字节码 (Windows 默认64位)
      await bytecode();
    }
  } catch (err) {
    console.error(err);
  }
};
