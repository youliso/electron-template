import type { BrowserWindowConstructorOptions } from 'electron';
import {
  logOn,
  fileOn,
  pathOn,
  machineOn,
  appBeforeOn,
  appProtocolRegister,
  globalInstance,
  shortcutInstance,
  windowInstance,
  Session,
  createTray,
  logError
} from '@youliso/electronic/main';
import { Update } from '@youliso/electronic/main/update';
import { join } from 'path';
import { app, nativeTheme } from 'electron';
import { customize, opt } from '@/cfg/window.json';
import updateCfg from '@/cfg/update.json';
import logo from '@/assets/icon/logo.png';

// @ts-ignore
let browserWindowOptions: BrowserWindowConstructorOptions = opt;

// 设置窗口管理默认参数
if (!app.isPackaged) {
  // 平台
  switch (process.platform) {
    case 'linux':
    case 'darwin':
      browserWindowOptions.frame = true;
      break;
  }
  // 调试模式
  if (browserWindowOptions.webPreferences) {
    browserWindowOptions.webPreferences.devTools = true;
  } else {
    browserWindowOptions.webPreferences = {
      devTools: true
    };
  }
  try {
    import('fs').then(({ readFileSync }) => {
      import('path').then(({ join }) => {
        windowInstance.setDefaultCfg({
          defaultLoadType: 'url',
          defaultUrl: `http://localhost:${readFileSync(join('.port'), 'utf8')}`,
          defaultPreload: join(__dirname, '../preload/index.js'),
          defaultCustomize: customize,
          defaultBrowserWindowOptions: browserWindowOptions
        });
      });
    });
  } catch (e) {
    throw 'not found .port';
  }
} else {
  windowInstance.setDefaultCfg({
    defaultLoadType: 'file',
    defaultUrl: join(__dirname, '../renderer/index.html'),
    defaultPreload: join(__dirname, '../preload/index.js'),
    defaultCustomize: customize,
    defaultBrowserWindowOptions: browserWindowOptions
  });
}

// 应用初始化之前监听和多窗口处理
appBeforeOn({
  additionalData: { type: 'new' },
  isFocusMainWin: true
});

// 注册协议
appProtocolRegister();

app
  .whenReady()
  .then(async () => {
    // 创建托盘
    const tray = createTray({
      name: customize.title,
      iconPath: logo as string
    });
    // 创建更新
    const update = new Update(
      { provider: updateCfg.provider as any, url: updateCfg.url },
      'resources/build/cfg/app-update.yml',
      updateCfg.dirname
    );
    // 创建session
    const session = new Session();
    // 模块监听
    logOn();
    fileOn();
    pathOn();
    machineOn();
    globalInstance.on();
    shortcutInstance.on();
    windowInstance.on();
    tray.on('click', () => windowInstance.func('show'));
    update.on();
    session.on();

    windowInstance.interceptor = (browserWindowOptions) => {
      if (process.platform === 'win32' && browserWindowOptions.titleBarStyle === 'hidden') {
        browserWindowOptions.titleBarOverlay = {
          color: nativeTheme.shouldUseDarkColors ? '#1e1e1e' : '#ffffff',
          symbolColor: nativeTheme.shouldUseDarkColors ? '#ffffff' : '#000000',
          height: 32
        };
      }
      return {
        ...browserWindowOptions
      };
    };

    // 监听系统主题变化
    nativeTheme.on('updated', () => {
      windowInstance.getAll().forEach((win) => {
        if (process.platform === 'win32') {
          win.setTitleBarOverlay({
            color: nativeTheme.shouldUseDarkColors ? '#1e1e1e' : '#ffffff',
            symbolColor: nativeTheme.shouldUseDarkColors ? '#ffffff' : '#000000'
          });
        }
      });
    });

    // 创建窗口
    const win = windowInstance.create(customize, browserWindowOptions);
    win && windowInstance.load(win, { openDevTools: !app.isPackaged }).catch(logError);
  })
  .catch(logError);
