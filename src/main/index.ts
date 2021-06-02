import { resolve } from 'path';
import { app, globalShortcut, ipcMain } from 'electron';
import { logOn } from './modular/log';
import { fileOn } from './modular/file';
import { Dialog } from './modular/dialog';
import { Menus } from './modular/menu';
import { Session } from './modular/session';
import { Update } from './modular/update';
import { Socket } from './modular/socket';
import Global from './modular/global';
import Window from './modular/window';
class Init {
  private dialog = new Dialog();
  private menus = new Menus();
  private socket = new Socket();
  private update = new Update();
  private session = new Session();

  constructor() {}

  /**
   * 初始化并加载
   * */
  async init() {
    //协议调起
    let args = [];
    if (!app.isPackaged) args.push(resolve(process.argv[1]));
    args.push('--');
    if (!app.isDefaultProtocolClient(app.name, process.execPath, args))
      app.setAsDefaultProtocolClient(app.name, process.execPath, args);
    app.allowRendererProcessReuse = true;
    //重复启动(单例)
    if (!app.requestSingleInstanceLock()) {
      app.quit();
    } else {
      app.on('second-instance', () => {
        // 当运行第二个实例时,将会聚焦到main窗口
        if (Window.main) {
          if (Window.main.isMinimized()) Window.main.restore();
          Window.main.focus();
        }
      });
    }
    //关闭所有窗口退出
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
    app.on('activate', () => {
      if (Window.getAllWindows().length === 0) {
        Window.createWindow({ isMainWin: true });
      }
    });
    //获得焦点时发出
    app.on('browser-window-focus', () => {
      //关闭刷新
      globalShortcut.register('CommandOrControl+R', () => {});
    });
    //失去焦点时发出
    app.on('browser-window-blur', () => {
      // 注销关闭刷新
      globalShortcut.unregister('CommandOrControl+R');
    });
    //app重启
    ipcMain.on('app-relaunch', () => {
      app.relaunch({ args: process.argv.slice(1) });
    });
    //启动
    await Promise.all([Global.init(), app.whenReady()]);
    //模块、创建窗口、托盘
    this.modular();
    Window.createWindow({ isMainWin: true });
    Window.createTray();
  }

  /**
   * 模块ipc监听
   * */
  modular() {
    logOn();
    fileOn();
    Global.on();
    Window.on();
    this.dialog.on();
    this.menus.on();
    this.session.on();
    this.socket.on();
    this.update.on();
  }
}

/**
 * 启动
 * */
new Init().init().then();
