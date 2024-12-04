const fs = require("node:fs");
const { join } = require('node:path');

module.exports = (appOutDir) => {
    const localeDir = join(appOutDir, 'locales', '/');
    fs.readdir(localeDir, function (err, files) {
        if (!(files && files.length)) return;
        for (let i = 0, len = files.length; i < len; i++) {
            if (!(files[i].startsWith("en") || files[i].startsWith("zh"))) {
                fs.unlinkSync(localeDir + files[i]);
            }
        }
    });
};