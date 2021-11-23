import { app, ipcMain, shell } from 'electron';
import { resolve } from 'path';
import { logError } from '@/main/modular/log';
import Shortcut from '@/main/modular/shortcut';
import Window from '@/main/modular/window';
import Global from '@/main/modular/global';

const { initRoute } = require('@/cfg/window.json');

export class App {
  private static instance: App;

  public modular: { [key: string]: any } = {};

  static getInstance() {
    if (!App.instance) App.instance = new App();
    return App.instance;
  }

  constructor() {}

  /**
   * 启动主进程
   */
  async start() {
    this.beforeOn();
    // 协议调起
    let argv = [];
    if (!app.isPackaged) argv.push(resolve(process.argv[1]));
    argv.push('--');
    if (!app.isDefaultProtocolClient(app.name, process.execPath, argv))
      app.setAsDefaultProtocolClient(app.name, process.execPath, argv);
    await app.whenReady().catch(logError);
    this.afterOn();
  }

  /**
   * 挂在模块
   * @param mod
   */
  async use(mod: Promise<any> | Promise<any>[]) {
    if (Array.isArray(mod)) {
      await Promise.all(mod)
        .then((res) => {
          for (let i = 0, len = res.length; i < len; i++) {
            this.modular[res[i].default.name] = new res[i].default();
            this.modular[res[i].default.name].on();
          }
        })
        .catch(logError);
    } else {
      await mod
        .then((req) => {
          this.modular[req.default.name] = new req.default();
          this.modular[req.default.name].on();
        })
        .catch(logError);
    }
  }

  /**
   * 监听
   */
  beforeOn() {
    // 默认单例根据自己需要改
    if (!app.requestSingleInstanceLock()) app.quit();
    else {
      app.on('second-instance', (event, argv) => {
        // 当运行第二个实例时,将会聚焦到main窗口
        if (Global.getGlobal('app.single')) {
          const main = Window.getMain();
          if (main) {
            if (main.isMinimized()) main.restore();
            main.show();
            main.focus();
          }
          return;
        }
        Window.create({
          customize: {
            route: initRoute,
            argv
          }
        });
      });
    }
    // 渲染进程崩溃监听
    app.on('render-process-gone', (event, webContents, details) =>
      logError(
        '[render-process-gone]',
        webContents.getTitle(),
        webContents.getURL(),
        JSON.stringify(details)
      )
    );
    // 子进程崩溃监听
    app.on('child-process-gone', (event, details) =>
      logError('[child-process-gone]', JSON.stringify(details))
    );
    // 关闭所有窗口退出
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
    });
  }

  /**
   * 监听
   */
  afterOn() {
    // darwin
    app.on('activate', () => {
      if (Window.getAll().length === 0) Window.create();
    });
    // 获得焦点时发出
    app.on('browser-window-focus', () => {
      // 关闭刷新
      Shortcut.register({
        name: '关闭刷新',
        key: 'CommandOrControl+R',
        callback: () => {}
      });
    });
    // 失去焦点时发出
    app.on('browser-window-blur', () => {
      // 注销关闭刷新
      Shortcut.unregister('CommandOrControl+R');
    });
    //app常用获取路径
    ipcMain.handle('app-path-get', (event, args) => {
      return app.getPath(args.key);
    });
    //app打开外部url
    ipcMain.handle('app-open-url', async (event, args) => {
      return await shell.openExternal(args.url);
    });
    //app重启
    ipcMain.on('app-relaunch', (event, args) => {
      app.relaunch({ args: process.argv.slice(1) });
      if (args) app.exit(0);
    });
  }
}

export default App.getInstance();
