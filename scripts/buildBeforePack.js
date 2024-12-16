const bytecode = require('./plugins/bytecode');

exports.default = async ({ packager }) => {
  try {
    let arch = packager.appInfo.platformSpecificOptions.target[0].arch[0];
    await bytecode(arch);
  } catch (err) {
    console.error(err);
  }
};
