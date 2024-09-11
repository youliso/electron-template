import fs from 'node:fs';
import packageCfg from '../package.json' assert { type: 'json' };
import envConfig from './cfg/env.json' assert { type: 'json' };
import config from './cfg/build.json' assert { type: 'json' };
import updateConfig from './cfg/update.json' assert { type: 'json' };

/** 渲染进程不需要打包到file的包 */
// config.files.push('!**/node_modules/包名');

/** env配置 **/
envConfig['process.env.PORT'] = JSON.stringify(4891);

/**  config配置  **/
config.appId = `org.${packageCfg.author.name}.${packageCfg.name}`;
config.copyright = `Copyright © 2024 ${packageCfg.name}`; //版权
config.productName = packageCfg.name; // 名称
config.npmRebuild = true; //是否Rebuild编译
config.asar = false; //asar开关
config.beforePack = 'scripts/buildBeforePack.js';

/** win配置 **/
config.nsis.shortcutName = packageCfg.productName; // 快捷方式名称
config.nsis.displayLanguageSelector = false; //安装包语言提示
config.nsis.menuCategory = true; //是否创建开始菜单目录
config.nsis.allowToChangeInstallationDirectory = true; //是否允许用户修改安装为位置
config.win.requestedExecutionLevel = ['asInvoker', 'highestAvailable'][0]; //应用权限

/** linux配置 **/
config.linux.target = 'AppImage'; //默认为AppImage
config.linux.executableName = packageCfg.name;

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
fs.writeFileSync('scripts/.build.json', JSON.stringify(config, null, 2));
fs.writeFileSync('scripts/.env.json', JSON.stringify(envConfig, null, 2));
