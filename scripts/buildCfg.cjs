const fs = require('node:fs');
const path = require('node:path');
const packageCfg = require('../package.json');
const envConfig = require('./cfg/env.json');
const config = require('./cfg/build.json');
const updateConfig = require('./cfg/update.json');
const signConfig = require('./cfg/sign.json');

const buildConfig = async (archPath, archTarget) => {

  /** 渲染进程不需要打包到file的包 */
  // config.files.push('!**/node_modules/包名');
  config.afterPack = 'scripts/buildAfterPack.js';
  config.beforePack = 'scripts/buildBeforePack.js';
  config.afterSign = 'scripts/buildAfterSign.js';

  /** env配置 **/
  envConfig['process.env.PORT'] = JSON.stringify(4891);

  /**  config配置  **/
  config.appId = `org.${packageCfg.author.name}.${packageCfg.name}`;
  config.copyright = `Copyright © 2024 ${packageCfg.name}`; //版权
  config.productName = packageCfg.name; // 名称
  config.npmRebuild = true; //是否Rebuild编译
  config.asar = true; //asar开关

  /** win配置 **/
  config.nsis.language = '2052'; // 2052 cn 1033 en-US
  config.nsis.installerLanguages = ['zh_CN', 'en_US'];
  config.nsis.shortcutName = packageCfg.productName; // 快捷方式名称
  config.nsis.displayLanguageSelector = false; //安装包语言提示
  config.nsis.menuCategory = true; //是否创建开始菜单目录
  config.nsis.allowToChangeInstallationDirectory = true; //是否允许用户修改安装为位置
  config.win.requestedExecutionLevel = ['asInvoker', 'highestAvailable'][0]; //应用权限

  /** linux配置 **/
  config.linux.target = 'AppImage'; //默认为AppImage
  config.linux.executableName = packageCfg.name;

  /** mac配置 **/
  signConfig.mac.identity && (config.mac.identity = signConfig.mac.identity); // 证书标识
  if (!signConfig.mac.notarize) {
    config.mac.identity = null;
    delete config.dmg.sign;
    delete config.mac.gatekeeperAssess;
  }

  // 动态配置
  if (archTarget) {
    config[archTarget.target].target = archTarget.value;
  }

  // 资源路径配置
  config.extraResources = [
    {
      from: 'resources/extern',
      to: 'extern/',
      filter: ['**/*']
    }
  ];
  try {
    fs.accessSync(path.resolve('./resources/' + archPath));
    config.extraResources.push({
      from: 'resources/' + archPath,
      to: archPath,
      filter: ['**/*']
    });
  } catch (error) {
    console.error(error);
  }

  //更新配置
  updateConfig.dirname = `${packageCfg.name.toLowerCase()}-updater`;
  config.publish = [
    {
      provider: updateConfig.provider,
      url: updateConfig.url
    }
  ];
  envConfig['process.env.UPDATEDIRNAME'] = JSON.stringify(updateConfig.dirname);
  let update =
    'provider: ' +
    updateConfig.provider +
    '\n' +
    'url: ' +
    updateConfig.url +
    '\n' +
    'updaterCacheDirName: ' +
    updateConfig.dirname +
    '';

  fs.writeFileSync('scripts/.update.yml', update);

  return {
    envConfig,
    buildConfig: config
  }
}

module.exports = {
  buildConfig
};
