import type { BrowserWindowConstructorOptions } from 'electron';
import { Platforms } from './platform';
import { logOn } from './modular/log';
import App from './modular/app';
import Global from './modular/global';
import Window from './modular/window';
import Tray from './modular/tray';

// 初始化创建窗口参数
const initWindowOpt: BrowserWindowConstructorOptions = {
  customize: {
    isMainWin: true,
    route: '/home'
  }
};

(async () => {
  await App.start();
  // 平台差异
  await Platforms[process.platform]();
  // 主要模块
  Global.on();
  Window.on();
  Tray.on();
  logOn();
  // 自定义模块
  await Promise.all([
    import('./modular/file').then(({ fileOn }) => fileOn()),
    import('./modular/path').then(({ pathOn }) => pathOn()),
    import('./modular/session').then(({ Session }) => new Session().on()),
    import('./modular/dialog').then(({ Dialog }) => new Dialog().on()),
    import('./modular/menu').then(({ Menus }) => new Menus().on()),
    import('./modular/update').then(({ Update }) => new Update().on()),
    import('./modular/socket').then(({ Socket }) => new Socket().on())
  ]);
  // 窗口
  Window.create(initWindowOpt);
  // 托盘
  Tray.create();
})();
