const { FuseVersion, FuseV1Options, flipFuses } = require('@electron/fuses');
const { join } = require('node:path');

module.exports = async (appOutDir, packager, electronPlatformName) => {
  if (packager.info._configuration.asar) {
    const ext = {
      darwin: '.app',
      win32: '.exe',
      linux: ['']
    }[electronPlatformName];
    const IS_LINUX = electronPlatformName === 'linux';
    const electronBinaryPath = join(
      appOutDir,
      `${
        IS_LINUX
          ? packager.appInfo.productFilename.toLocaleLowerCase()
          : packager.appInfo.productFilename
      }${ext}`
    );
    await flipFuses(electronBinaryPath, {
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    });
  }
};
