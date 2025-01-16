const fuses = require('./plugins/fuses');
const removeLocales = require('./plugins/removeLocales');

exports.default = async ({ appOutDir, packager, electronPlatformName }) => {
  try {
    await fuses(appOutDir, packager, electronPlatformName);
    if (
      electronPlatformName === 'win32' &&
      packager.appInfo.platformSpecificOptions.target[0].target === 'nsis'
    ) {
      removeLocales(appOutDir);
    }
  } catch (err) {
    console.error(err);
  }
};
