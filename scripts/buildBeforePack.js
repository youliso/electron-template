const bytecode = require('./plugins/bytecode');

exports.default = async ({ electronPlatformName, arch }) => {
  try {
    //v8字节码  如果在windows64下打包32位请先将electron 切换到32位
    await bytecode(electronPlatformName, arch);
  } catch (err) {
    console.error(err);
  }
};
