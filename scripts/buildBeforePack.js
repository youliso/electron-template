const bytecode = require('./plugins/bytecode');

exports.default = async ({ packager }) => {
  try {
    if (!packager.info._configuration.asar) {
      //v8字节码 (Windows 默认64位)
      let arch = packager.appInfo.platformSpecificOptions.target[0].arch[0];
      if (process.platform === 'win32' && arch === 'ia32') {
        console.log(`  \x1B[31m•\x1B[0m byteCode Does not support 32-bit Windows platform \x1B[34m\x1B[0m`);
      } else {
        await bytecode(arch);
      }
    }
  } catch (err) {
    console.error(err);
  }
};
