const asarmor = require('./plugins/asarmor');
const removeLocales = require('./plugins/removeLocales');

exports.default = async ({ appOutDir, packager }) => {
  try {
    let target = packager.appInfo.platformSpecificOptions.target[0];
    if (packager.info._configuration.asar) {
      asarmor(packager.getResourcesDir(appOutDir));
    }
    if (target.target === 'nsis') {
      removeLocales(appOutDir);
    }
  } catch (err) {
    console.error(err);
  }
};
