import type { BrowserWindowConstructorOptions, LoadFileOptions, LoadURLOptions } from 'electron';
import { join } from 'path';
import { app, screen, ipcMain, BrowserWindow } from 'electron';
import { isNull } from '@/utils';

const windowCfg = require('@/cfg/window.json');

/**
 * 窗口配置
 * @param args
 */
export function browserWindowInit(args: BrowserWindowConstructorOptions): BrowserWindow {
  if (!args || !args.customize) throw new Error('not args');
  args.minWidth = args.minWidth || args.width || windowCfg.width;
  args.minHeight = args.minHeight || args.height || windowCfg.height;
  args.width = args.width || windowCfg.width;
  args.height = args.height || windowCfg.height;
  // darwin下modal会造成整个窗口关闭(?)
  if (process.platform === 'darwin') delete args.modal;
  const isLocal = !args.customize.route;
  let opt: BrowserWindowConstructorOptions = Object.assign(args, {
    autoHideMenuBar: true,
    titleBarStyle: args.customize.route ? 'hidden' : 'default',
    minimizable: true,
    maximizable: true,
    frame: isLocal,
    show: isLocal,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !app.isPackaged,
      webSecurity: false
    }
  });
  if (!opt.backgroundColor && windowCfg.backgroundColor)
    opt.backgroundColor = windowCfg.backgroundColor;
  if (!isNull(opt.customize.parentId)) {
    opt.parent = Window.getInstance().get(opt.customize.parentId);
    const currentWH = opt.parent.getBounds();
    opt.customize.currentWidth = currentWH.width;
    opt.customize.currentHeight = currentWH.height;
    opt.customize.currentMaximized = opt.parent.isMaximized();
    if (opt.customize.currentMaximized) {
      const displayWorkAreaSize = screen.getPrimaryDisplay().workAreaSize;
      opt.x = ((displayWorkAreaSize.width - (opt.width || 0)) / 2) | 0;
      opt.y = ((displayWorkAreaSize.height - (opt.height || 0)) / 2) | 0;
    } else {
      const currentPosition = opt.parent.getPosition();
      opt.x =
        (currentPosition[0] + (currentWH.width - (opt.width || opt.customize.currentWidth)) / 2) |
        0;
      opt.y =
        (currentPosition[1] +
          (currentWH.height - (opt.height || opt.customize.currentHeight)) / 2) |
        0;
    }
  } else {
    const main = Window.getInstance().getMain();
    if (main) {
      const mainPosition = main.getPosition();
      const mainBounds = main.getBounds();
      opt.x = (mainPosition[0] + (mainBounds.width - opt.width) / 2) | 0;
      opt.y = (mainPosition[1] + (mainBounds.height - opt.height) / 2) | 0;
    }
  }
  const win = new BrowserWindow(opt);
  win.customize = {
    id: win.id,
    ...opt.customize
  };
  if (!win.customize.argv) win.customize.argv = process.argv;
  return win;
}

/**
 * 窗口加载
 */
function load(win: BrowserWindow) {
  win.webContents.on('did-finish-load', () => win.webContents.send('window-load', win.customize));
  // 窗口最大最小监听
  win.on('maximize', () => win.webContents.send('window-maximize-status', 'maximize'));
  win.on('unmaximize', () => win.webContents.send('window-maximize-status', 'unmaximize'));
  // 聚焦失焦监听
  win.on('blur', () => win.webContents.send('window-blur-focus', 'blur'));
  win.on('focus', () => win.webContents.send('window-blur-focus', 'focus'));
  if (win.customize.url.startsWith('https://') || win.customize.url.startsWith('http://')) {
    win.loadURL(win.customize.url, win.customize.loadOptions as LoadURLOptions);
    return;
  }
  win.loadFile(win.customize.url, win.customize.loadOptions as LoadFileOptions);
}

export class Window {
  private static instance: Window;

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
   * 获取主窗口(无主窗口获取后存在窗口)
   */
  getMain() {
    const all = BrowserWindow.getAllWindows().reverse();
    let win: BrowserWindow = null;
    for (let index = 0; index < all.length; index++) {
      const item = all[index];
      if (index === 0) win = item;
      if (item.customize.isMainWin) {
        win = item;
        break;
      }
    }
    return win;
  }

  /**
   * 创建窗口
   * */
  create(args?: BrowserWindowConstructorOptions) {
    args = args || {
      customize: {
        route: windowCfg.initRoute
      }
    };
    if (args.customize.isOneWindow) {
      for (const i of this.getAll()) {
        if (
          (args.customize?.route && args.customize.route === i.customize?.route) ||
          (args.customize?.url && args.customize.url === i.customize?.url)
        ) {
          i.focus();
          return;
        }
      }
    }
    const win = browserWindowInit(args);
    // 路由 > url
    if (!app.isPackaged) {
      //调试模式
      try {
        import('fs').then(({ readFileSync }) => {
          const appPort = readFileSync(join('.port'), 'utf8');
          win.webContents.openDevTools({ mode: 'detach' });
          if (!win.customize.url) win.customize.url = `http://localhost:${appPort}`;
          load(win);
        });
      } catch (e) {
        throw 'not found .port';
      }
      return;
    }
    if (!win.customize.url) win.customize.url = join(__dirname, '../index.html');
    load(win);
  }

  /**
   * 窗口关闭、隐藏、显示等常用方法
   */
  func(type: windowFuncOpt, id?: number) {
    let win: BrowserWindow = null;
    if (!isNull(id)) {
      win = this.get(id);
      if (!win) {
        console.error(`not found win -> ${id}`);
        return;
      }
      win[type]();
      return;
    }
    for (const i of this.getAll()) i[type]();
  }

  /**
   * 窗口发送消息
   */
  send(key: string, value: any, id?: number) {
    if (!isNull(id)) {
      const win = this.get(id);
      if (win) win.webContents.send(key, value);
    } else for (const i of this.getAll()) i.webContents.send(key, value);
  }

  /**
   * 窗口状态
   */
  getStatus(type: windowStatusOpt, id: number) {
    const win = this.get(id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    return win[type]();
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
      width: args.size[0] | 0,
      height: args.size[1] | 0
    };
    const win = this.get(args.id);
    const winBounds = win.getBounds();
    if (Rectangle.width === winBounds.width && Rectangle.height === winBounds.height) return;
    if (!args.center) {
      const winPosition = win.getPosition();
      Rectangle.x = (winPosition[0] + (winBounds.width - args.size[0]) / 2) | 0;
      Rectangle.y = (winPosition[1] + (winBounds.height - args.size[1]) / 2) | 0;
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
    this.get(args.id).setBackgroundColor(args.color || windowCfg.backgroundColor);
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
    // 窗口数据更新
    ipcMain.on('window-update', (event, args) => {
      if (args?.id) this.get(args.id).customize = args;
    });
    // 最大化最小化窗口
    ipcMain.on('window-max-min-size', (event, id) => {
      if (!isNull(id)) {
        const win = this.get(id);
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
      }
    });
    // 窗口消息
    ipcMain.on('window-func', (event, args) => this.func(args.type, args.id));
    // 窗口状态
    ipcMain.handle('window-status', async (event, args) => this.getStatus(args.type, args.id));
    // 创建窗口
    ipcMain.on('window-new', (event, args) => this.create(args));
    // 设置窗口是否置顶
    ipcMain.on('window-always-top-set', (event, args) => this.setAlwaysOnTop(args));
    // 设置窗口大小
    ipcMain.on('window-size-set', (event, args) => this.setSize(args));
    // 设置窗口最小大小
    ipcMain.on('window-min-size-set', (event, args) => this.setMinSize(args));
    // 设置窗口最大大小
    ipcMain.on('window-max-size-set', (event, args) => this.setMaxSize(args));
    // 设置窗口背景颜色
    ipcMain.on('window-bg-color-set', (event, args) => this.setBackgroundColor(args));
    // 窗口消息
    ipcMain.on('window-message-send', (event, args) => {
      const channel = `window-message-${args.channel}-back`;
      if (args.acceptIds && args.acceptIds.length > 0) {
        for (const i of args.acceptIds) this.send(channel, args.value, i);
        return;
      }
      if (args.isback) this.send(channel, args.value);
      else
        for (const win of this.getAll())
          if (win.id !== args.id) win.webContents.send(channel, args.value);
    });
    //通过路由获取窗口id (不传route查全部)
    ipcMain.handle('window-id-get', async (event, args) => {
      return this.getAll()
        .filter((win) => (args.route ? win.customize?.route === args.route : true))
        .map((win) => win.id);
    });
  }
}

export default Window.getInstance();
