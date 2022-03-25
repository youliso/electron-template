import App from './modular/app';
import Shortcut from './modular/shortcut';
import Global from './modular/global';
import Window from './modular/window';
import Tray from './modular/tray';
import Session from './modular/session';
import Dialog from './modular/dialog';
import Menu from './modular/menu';
import Update from './modular/update';
import { logOn } from './modular/log';
import { pathOn } from './modular/path';
import { fileOn } from './modular/file';
import { customize, opt } from '@/cfg/window.json';

App.start().then(async () => {
  // 主要模块
  Shortcut.on();
  Global.on();
  Window.on();
  Tray.on();
  logOn();
  // 可选模块
  fileOn();
  pathOn();
  await App.use([Session, Dialog, Menu, Update]);
  // 窗口
  Window.create(customize, opt);
  // 托盘
  Tray.create();
});
