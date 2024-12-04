const asarmor = require('./plugins/asarmor');

exports.default = async ({ appOutDir, packager }) => {
  try {
    if (packager.info._configuration.asar) {
      asarmor(packager.getResourcesDir(appOutDir));
    }
  } catch (err) {
    console.error(err);
  }
};
