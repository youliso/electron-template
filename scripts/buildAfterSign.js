const notarize = require('./plugins/notarize');

exports.default = async ({ appOutDir, packager, electronPlatformName }) => {
  try {
    if (electronPlatformName === 'darwin') {
      return await notarize(appOutDir, packager);
    }
  } catch (err) {
    console.error(err);
  }
};
