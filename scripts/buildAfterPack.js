const asarmor = require('./plugins/asarmor');
const { asar } = require('./.build.json');

exports.default = async ({ appOutDir, packager }) => {
  try {
    if (asar) {
      asarmor(appOutDir);
    }
  } catch (err) {
    console.error(err);
  }
};
