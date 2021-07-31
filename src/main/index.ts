import type { BrowserWindowConstructorOptions } from 'electron';
import { Platforms } from './platform';
import { logOn } from './modular/log';
import { pathOn } from './modular/path';
import { fileOn } from './modular/file';
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
  // 启动
  await App.start();
  // 平台差异
  await Platforms[process.platform]();
  // 主要模块
  App.on();
  Global.on();
  Window.on();
  Tray.on();
  logOn();
  // 可选模块
  fileOn();
  pathOn();
  await App.uses([
    import('./modular/session'),
    import('./modular/dialog'),
    import('./modular/menu'),
    import('./modular/update'),
    import('./modular/socket')
  ]);
  // 窗口
  Window.create(initWindowOpt);
  // 托盘
  Tray.create();
})();
