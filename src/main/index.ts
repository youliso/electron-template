import type { BrowserWindowConstructorOptions } from 'electron';
import type { Customize } from '@youliso/electronic/types';
import {
  type WindowDefaultCfg,
  machineOn,
  appAfterOn,
  appSingleInstanceLock,
  appProtocolRegister,
  storeInstance,
  shortcutInstance,
  windowInstance,
  preload
} from '@youliso/electronic/main';
import { join } from 'path';
import { app, Menu, nativeImage, Tray } from 'electron';
import logo from '@/assets/icon/logo.png';
import { resourcesOn } from './modular/resources';
import { defaultSessionInit, sessionOn } from './modular/session';
import { updateOn } from './modular/update';

preload.initialize();

// 初始渲染进程参数
let route = '/home';
let customize: Customize = {
  title: app.name,
  route
};

// 初始窗口参数
let browserWindowOptions: BrowserWindowConstructorOptions = {
  width: 800,
  height: 600,
  frame: true,
  show: false,
  webPreferences: {
    devTools: true
  }
};

// 初始窗口组参数
let windowDefaultCfg: WindowDefaultCfg = {
  defaultLoadType: 'file',
  defaultUrl: join(__dirname, 'index.html'),
  defaultPreload: join(__dirname, 'preload.js')
};

// 调试模式
if (!app.isPackaged) {
  if (browserWindowOptions.webPreferences) {
    browserWindowOptions.webPreferences.devTools = true;
  } else {
    browserWindowOptions.webPreferences = {
      devTools: true
    };
  }
  windowDefaultCfg.defaultLoadType = 'url';
  windowDefaultCfg.defaultUrl = `http://localhost:${process.env.PORT}`;
}

windowInstance.setDefaultCfg(windowDefaultCfg);

// 单例
appSingleInstanceLock({
  secondInstanceFunc: (_, argv) => {
    //多窗口聚焦到第一实例
    const main = windowInstance.getMain();
    if (main) {
      preload.send('window-single-instance', argv, [main.id]);
    }
  }
});

// 注册协议
appProtocolRegister();

// 关闭所有窗口退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(async () => {
  app.on('activate', () => {
    const mainWin = windowInstance.getMain();
    if (mainWin && mainWin.customize.route === route) {
      mainWin.show();
    } else {
      windowInstance.new(customize, browserWindowOptions);
    }
  });
  // 获得焦点时发出
  app.on('browser-window-focus', () => {
    // 关闭刷新
    shortcutInstance.register({
      name: '关闭刷新',
      key: 'CommandOrControl+R'
    });
  });
  // 失去焦点时发出
  app.on('browser-window-blur', () => {
    // 注销关闭刷新
    shortcutInstance.unregister('CommandOrControl+R');
  });

  defaultSessionInit();

  // 应用基础监听
  appAfterOn();

  // 模块监听
  updateOn();
  sessionOn();
  machineOn();
  resourcesOn();
  storeInstance.on();
  windowInstance.on();
  shortcutInstance.on();

  // 创建托盘
  const tray = new Tray(nativeImage.createFromPath(join(__dirname, logo)));
  tray.setToolTip(app.getName());
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Exit',
        click: () => {
          app.quit();
        }
      }
    ])
  );

  tray.on('click', () => windowInstance.func('show'));
  // 创建窗口
  await windowInstance.new(customize, browserWindowOptions);
});
