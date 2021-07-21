import { join } from 'path';
import { app, screen, BrowserWindow, ipcMain, BrowserWindowConstructorOptions } from 'electron';
import { isNull } from '@/lib';
import { logError } from '@/main/modular/log';
const { appBackgroundColor, appW, appH } = require('@/cfg/index.json');

/**
 * 窗口配置
 * @param args
 */
export function browserWindowInit(args: BrowserWindowConstructorOptions): BrowserWindow {
  args.minWidth = args.minWidth || args.width || appW;
  args.minHeight = args.minHeight || args.height || appH;
  args.width = args.width || appW;
  args.height = args.height || appH;
  let opt: BrowserWindowConstructorOptions = Object.assign(args, {
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    minimizable: true,
    maximizable: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, './preload.bundle.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !app.isPackaged,
      webSecurity: false
    }
  });
  if (opt.customize.parentId) {
    opt.parent = Window.getInstance().get(opt.customize.parentId);
    const currentWH = opt.parent.getBounds();
    opt.customize.currentWidth = currentWH.width;
    opt.customize.currentHeight = currentWH.height;
    opt.customize.currentMaximized = opt.parent.isMaximized();
    if (opt.customize.currentMaximized) {
      const displayWorkAreaSize = screen.getPrimaryDisplay().workAreaSize;
      opt.x = Math.round((displayWorkAreaSize.width - (opt.width || 0)) / 2);
      opt.y = Math.round((displayWorkAreaSize.height - (opt.height || 0)) / 2);
    } else {
      const currentPosition = opt.parent.getPosition();
      opt.x = Math.round(
        currentPosition[0] + (currentWH.width - (opt.width || opt.customize.currentWidth)) / 2
      );
      opt.y = Math.round(
        currentPosition[1] + (currentWH.height - (opt.height || opt.customize.currentHeight)) / 2
      );
    }
  } else if (Window.getInstance().main) {
    const mainPosition = Window.getInstance().main.getPosition();
    const mainBounds = Window.getInstance().main.getBounds();
    opt.x = Math.round(mainPosition[0] + (mainBounds.width - opt.width) / 2);
    opt.y = Math.round(mainPosition[1] + (mainBounds.height - opt.height) / 2);
  }
  const win = new BrowserWindow(opt);
  win.customize = {
    id: win.id,
    ...opt.customize
  };
  return win;
}

export class Window {
  private static instance: Window;

  public main: BrowserWindow = null; //当前主页

  static getInstance() {
    if (!Window.instance) Window.instance = new Window();
    return Window.instance;
  }

  constructor() {}

  /**
   * 获取窗口
   * @param id 窗口id
   * @constructor
   */
  get(id: number) {
    return BrowserWindow.fromId(id);
  }

  /**
   * 获取全部窗口
   */
  getAll() {
    return BrowserWindow.getAllWindows();
  }

  /**
   * 创建窗口
   * */
  create(args: BrowserWindowConstructorOptions) {
    for (const i of this.getAll()) {
      if (i && i.customize.route === args.customize.route && !i.customize.isMultiWindow) {
        i.focus();
        return;
      }
    }
    const win = browserWindowInit(args);
    if (win.customize.isMainWin) {
      //是否主窗口
      if (this.main && !this.main.isDestroyed()) {
        this.main.close();
        delete this.main;
      }
      this.main = win;
    }
    //注入初始化代码
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('window-load', win.customize);
    });
    //聚焦失焦监听
    win.on('blur', () => win.webContents.send('window-blur-focus', 'blur'));
    win.on('focus', () => win.webContents.send('window-blur-focus', 'focus'));
    if (!app.isPackaged) {
      //调试模式
      try {
        import('fs').then(({ readFileSync }) => {
          const appPort = readFileSync(join('.port'), 'utf8');
          win.loadURL(`http://localhost:${appPort}`).then().catch(logError);
          win.webContents.openDevTools({ mode: 'detach' });
        });
      } catch (e) {
        throw 'not found .port';
      }
    } else win.loadFile(join(__dirname, './index.html')).then().catch(logError);
  }

  /**
   * 窗口关闭、隐藏、显示等常用方法
   */
  func(type: windowFunOpt, id?: number) {
    switch (type) {
      case 'close':
        if (!isNull(id)) {
          if (this.get(id)) this.get(id).close();
          return;
        }
        for (const i of this.getAll()) if (i) i.close();
        break;
      case 'hide':
        if (!isNull(id)) {
          if (this.get(id)) this.get(id).hide();
          return;
        }
        for (const i of this.getAll()) if (i) i.hide();
        break;
      case 'show':
        if (!isNull(id)) {
          if (this.get(id)) this.get(id).show();
          return;
        }
        for (const i of this.getAll()) if (i) i.show();
        break;
      case 'minimize':
        if (!isNull(id)) {
          if (this.get(id)) this.get(id).minimize();
          return;
        }
        for (const i of this.getAll()) if (i) i.minimize();
        break;
      case 'maximize':
        if (!isNull(id)) {
          if (this.get(id)) this.get(id).maximize();
          return;
        }
        for (const i of this.getAll()) if (i) i.maximize();
        break;
      case 'restore':
        if (!isNull(id)) {
          if (this.get(id)) this.get(id).restore();
          return;
        }
        for (const i of this.getAll()) if (i) i.restore();
        break;
      case 'reload':
        if (!isNull(id)) {
          if (this.get(id)) this.get(id).reload();
          return;
        }
        for (const i of this.getAll()) if (i) i.reload();
        break;
    }
  }

  /**
   * 窗口发送消息
   */
  send(key: string, value: any, id?: number) {
    if (!isNull(id)) this.get(id).webContents.send(key, value);
    else for (const i of this.getAll()) if (i) i.webContents.send(key, value);
  }

  /**
   * 窗口状态
   */
  getStatus(type: windowStatusOpt, id: number) {
    if (isNull(id)) console.error('Invalid id, the id can not be a empty');
    else
      switch (type) {
        case 'isMaximized':
          return this.get(id).isMaximized();
        case 'isMinimized':
          return this.get(id).isMinimized();
        case 'isFullScreen':
          return this.get(id).isFullScreen();
        case 'isAlwaysOnTop':
          return this.get(id).isAlwaysOnTop();
        case 'isVisible':
          return this.get(id).isVisible();
        case 'isFocused':
          return this.get(id).isFocused();
        case 'isModal':
          return this.get(id).isModal();
      }
  }

  /**
   * 设置窗口最小大小
   */
  setMinSize(args: { id: number; size: number[] }) {
    this.get(args.id).setMinimumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口最大大小
   */
  setMaxSize(args: { id: number; size: number[] }) {
    this.get(args.id).setMaximumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口大小
   */
  setSize(args: { id: number; size: number[]; resizable: boolean; center: boolean }) {
    let Rectangle: { [key: string]: number } = {
      width: Math.round(args.size[0]),
      height: Math.round(args.size[1])
    };
    const win = this.get(args.id);
    const winBounds = win.getBounds();
    const winPosition = win.getPosition();
    if (Rectangle.width === winBounds.width && Rectangle.height === winBounds.height) return;
    if (!args.center) {
      Rectangle.x = Math.round(winPosition[0] + (winBounds.width - args.size[0]) / 2);
      Rectangle.y = Math.round(winPosition[1] + (winBounds.height - args.size[1]) / 2);
    }
    win.once('resize', () => {
      if (args.center) win.center();
    });
    win.setResizable(args.resizable);
    win.setMinimumSize(Rectangle.width, Rectangle.height);
    win.setBounds(Rectangle);
  }

  /**
   * 设置窗口背景色
   */
  setBackgroundColor(args: { id: number; color: string }) {
    this.get(args.id).setBackgroundColor(args.color || appBackgroundColor);
  }

  /**
   * 设置窗口是否置顶
   */
  setAlwaysOnTop(args: { id: number; is: boolean; type?: windowAlwaysOnTopOpt }) {
    this.get(args.id).setAlwaysOnTop(args.is, args.type || 'normal');
  }

  /**
   * 开启监听
   */
  on() {
    //窗口数据更新
    ipcMain.on('window-update', (event, args) => {
      if (args && !isNull(args.id)) this.get(args.id).customize = args;
    });
    //最大化最小化窗口
    ipcMain.on('window-max-min-size', (event, id) => {
      if (!isNull(id))
        if (this.get(id).isMaximized()) this.get(id).unmaximize();
        else this.get(id).maximize();
    });
    //窗口消息
    ipcMain.on('window-fun', (event, args) => this.func(args.type, args.id));
    //窗口状态
    ipcMain.handle('window-status', (event, args) => this.getStatus(args.type, args.id));
    //创建窗口
    ipcMain.on('window-new', (event, args) => this.create(args));
    //设置窗口是否置顶
    ipcMain.on('window-always-top-set', (event, args) => this.setAlwaysOnTop(args));
    //设置窗口大小
    ipcMain.on('window-size-set', (event, args) => this.setSize(args));
    //设置窗口最小大小
    ipcMain.on('window-min-size-set', (event, args) => this.setMinSize(args));
    //设置窗口最大大小
    ipcMain.on('window-max-size-set', (event, args) => this.setMaxSize(args));
    //设置窗口背景颜色
    ipcMain.on('window-bg-color-set', (event, args) => this.setBackgroundColor(args));
    //窗口消息
    ipcMain.on('window-message-send', (event, args) => {
      let channel = `window-message-${args.channel}-back`;
      if (!isNull(args.acceptIds) && args.acceptIds.length > 0) {
        for (let i of args.acceptIds) {
          if (this.get(Number(i))) this.get(Number(i)).webContents.send(channel, args.value);
        }
        return;
      }
      if (args.isback) {
        for (const i of this.getAll()) {
          if (this.get(Number(i))) this.get(Number(i)).webContents.send(channel, args.value);
        }
      } else {
        for (const i of this.getAll()) {
          if (this.get(Number(i)) && Number(i) !== args.id)
            this.get(Number(i)).webContents.send(channel, args.value);
        }
      }
    });
    //通过路由获取窗口id (不传route查全部)
    ipcMain.on('window-id-get', (event, args) => {
      let winIds: number[] = [];
      if (args.route) {
        for (const i of this.getAll()) {
          if (i && i.customize.route === args.route) winIds.push(i.id);
        }
      } else winIds = this.getAll().map((win) => win.id);
      event.returnValue = winIds;
    });
  }
}

export default Window.getInstance();
