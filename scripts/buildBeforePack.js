const bytecode = require('./plugins/bytecode');

exports.default = async ({ packager }) => {
  try {
    if (!packager.info._configuration.asar) {
      //v8字节码 (Windows 默认64位)
      await bytecode();
    }
  } catch (err) {
    console.error(err);
  }
};
