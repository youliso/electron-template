const { FuseVersion, FuseV1Options, flipFuses } = require("@electron/fuses");
const { join } = require('node:path');

module.exports = async (appOutDir, packager, electronPlatformName, arch) => {
  if (packager.info._configuration.asar) {
    const ext = {
      darwin: '.app',
      win32: '.exe',
      linux: [''],
    }[electronPlatformName];
    const electronBinaryPath = join(appOutDir, `${packager.appInfo.productFilename}${ext}`);
    await flipFuses(
      electronBinaryPath,
      {
        version: FuseVersion.V1,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        [FuseV1Options.OnlyLoadAppFromAsar]: true
      },
    );
  }
};
