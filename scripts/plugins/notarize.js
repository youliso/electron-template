const { notarize } = require('@electron/notarize');
const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { mac } = require('../cfg/sign.json');

module.exports = async (appOutDir, packager) => {
  if (!mac.notarize) return;
  const appName = packager.appInfo.productFilename;
  const appPath = join(appOutDir, `${appName}.app`);
  if (!existsSync(appPath)) {
    throw new Error(`Cannot find application for notarization at: ${appPath}`);
  }
  console.log(`Notarizing app found at: ${appPath}`);
  console.log('This can take several minutes.');
  return await notarize({
    tool: 'notarytool',
    appBundleId: JSON.parse(require('../.env.json')['process.env.APPID']),
    appPath,
    appleId: mac.appleId,
    appleIdPassword: mac.appleIdPassword,
    teamId: mac.teamId,
  });
}