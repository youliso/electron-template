const fs = require('node:fs');
const { join } = require('node:path');

module.exports = (appOutDir, locales = ['en', 'zh']) => {
  const localeDir = join(appOutDir, 'locales', '/');
  fs.readdir(localeDir, (_, files) => {
    if (!(files && files.length)) return;
    for (let i = 0, len = files.length; i < len; i++) {
      if (locales.filter((v) => files[i].startsWith(v)).length === 0) {
        fs.unlinkSync(localeDir + files[i]);
      }
    }
  });
};
