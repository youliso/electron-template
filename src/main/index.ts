import { resolve } from 'path';
import { app, globalShortcut, ipcMain } from 'electron';
import { logOn, logError } from './modular/log';
import { fileOn } from './modular/file';
import { pathOn } from './modular/path';
import Global from './modular/global';
import Window from './modular/window';
import { WindowOpt } from '@/lib/interface';

class Init {

  private initWindowOpt: WindowOpt = { //初始化创建窗口参数
    isMainWin: true,
    route: '/'
  };

  constructor() {
  }

  /**
   * 初始化并加载
   * */
  async init() {
    app.allowRendererProcessReuse = true;
    //协议调起
    let argv = [];
    if (!app.isPackaged) argv.push(resolve(process.argv[1]));
    argv.push('--');
    if (!app.isDefaultProtocolClient(app.name, process.execPath, argv))
      app.setAsDefaultProtocolClient(app.name, process.execPath, argv);
    //默认单例根据自己需要改
    if (!app.requestSingleInstanceLock()) app.quit();
    else {
      app.on('second-instance', (event, argv) => {
        // 当运行第二个实例时,将会聚焦到main窗口
        if (Window.main) {
          if (Window.main.isMinimized()) Window.main.restore();
          Window.main.focus();
        }
      });
    }
    //渲染进程崩溃监听
    app.on('render-process-gone', (event, webContents, details) => logError('[render-process-gone]', webContents.getTitle(), webContents.getURL(), JSON.stringify(details)));
    //子进程崩溃监听
    app.on('child-process-gone', (event, details) => logError('[child-process-gone]', JSON.stringify(details)));
    //关闭所有窗口退出
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
    app.on('activate', () => {
      if (Window.windowsAllGet().length === 0) {
        Window.windowCreate(this.initWindowOpt);
      }
    });
    //获得焦点时发出
    app.on('browser-window-focus', () => {
      //关闭刷新
      globalShortcut.register('CommandOrControl+R', () => {
      });
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
    Window.windowCreate(this.initWindowOpt);
    Window.trayCreate();
  }

  /**
   * 模块ipc监听
   * */
  modular() {
    logOn();
    fileOn();
    pathOn();
    Global.on();
    Window.on();

    //自定义模块
    import('./modular/dialog').then(({ Dialog }) => new Dialog().on());
    import('./modular/menu').then(({ Menus }) => new Menus().on());
    import('./modular/session').then(({ Session }) => new Session().on());
    import('./modular/update').then(({ Update }) => new Update().on());
    import('./modular/socket').then(({ Socket }) => new Socket().on());
  }
}

/**
 * 启动
 * */
new Init().init().then();
