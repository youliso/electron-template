const notarize = require('./plugins/notarize');

exports.default = async ({ appOutDir, packager }) => {
  try {
    if (process.platform === 'darwin') {
      return await notarize(appOutDir, packager);
    }
  } catch (err) {
    console.error(err);
  }
};
