import App from './modular/app';
import Shortcut from './modular/shortcut';
import Global from './modular/global';
import Window from './modular/window';
import Tray from './modular/tray';
import { logOn } from './modular/log';
import { pathOn } from './modular/path';
import { fileOn } from './modular/file';

await App.start();
// 主要模块
Shortcut.on();
Global.on();
Window.on();
Tray.on();
logOn();
// 可选模块
fileOn();
pathOn();
await App.use([
  import('./modular/session'),
  import('./modular/dialog'),
  import('./modular/menu'),
  import('./modular/update'),
  import('./modular/socket')
]);
// 窗口
Window.create();
// 托盘
Tray.create();
