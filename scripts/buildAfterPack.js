const asarmor = require('./plugins/asarmor');
const { asar } = require('./.build.json');

exports.default = async ({ appOutDir }) => {
  try {
    if (asar) {
      asarmor(appOutDir);
    }
  } catch (err) {
    console.error(err);
  }
};
