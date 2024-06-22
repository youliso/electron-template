const fs = require('fs');
const { name, author } = require('../package.json');
const config = require('./build.json');
const updateConfig = require('../src/cfg/update.json');

/** 渲染进程不需要打包到file的包 */
// config.files.push('!**/node_modules/包名');

/**  config配置  **/
config.publish = [
  {
    provider: updateConfig.provider,
    url: updateConfig.url
  }
];
config.productName = name;
config.appId = `org.${author.name}.${name}`;
config.npmRebuild = true; //是否Rebuild编译
config.asar = true; //asar开关
config.afterPack = 'scripts/buildAfterPack.js'; //asar混淆
config.beforePack = 'scripts/buildBeforePack.js';

/** win配置 **/
config.nsis.displayLanguageSelector = false; //安装包语言提示
config.nsis.menuCategory = false; //是否创建开始菜单目录
config.nsis.shortcutName = name; //快捷方式名称(可中文)
config.nsis.allowToChangeInstallationDirectory = true; //是否允许用户修改安装为位置
config.win.requestedExecutionLevel = ['asInvoker', 'highestAvailable'][0]; //应用权限

/** linux配置 **/
config.linux.target = 'AppImage'; //默认为AppImage
config.linux.executableName = name;

//更新配置
updateConfig.dirname = `${name.toLowerCase()}-updater`;
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

fs.writeFileSync('scripts/dev-update.yml', update);
fs.writeFileSync('scripts/build.json', JSON.stringify(config, null, 2));
fs.writeFileSync('src/cfg/update.json', JSON.stringify(updateConfig, null, 2));
