const bytecode = require('./plugins/bytecode');
const { asar } = require('./.build.json');

exports.default = async (context) => {
  try {
    if (!asar) {
      //v8字节码
      await bytecode();
    }
  } catch (err) {
    console.error(err);
  }
};
