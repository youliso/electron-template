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
  Update,
  logError
} from '@youliso/electronic/main';
import { join } from 'path';
import { app } from 'electron';
import { customize, opt } from '@/cfg/window.json';
import updateCfg from '@/cfg/update.json';
import logo from '@/assets/icon/logo.png';

let browserWindowOptions: BrowserWindowConstructorOptions = opt;

// 设置窗口管理默认参数
if (!app.isPackaged) {
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

    // 创建窗口
    const win = windowInstance.create(customize, browserWindowOptions);
    win && windowInstance.load(win, { openDevTools: !app.isPackaged }).catch(logError);
  })
  .catch(logError);
