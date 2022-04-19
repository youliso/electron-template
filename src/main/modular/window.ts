import type {
  BrowserWindowConstructorOptions,
  LoadFileOptions,
  LoadURLOptions,
  WebContents
} from 'electron';
import { join } from 'path';
import { app, screen, ipcMain, BrowserWindow } from 'electron';
import windowCfg from '@/cfg/window.json';

/**
 * 窗口配置
 * @param customize
 * @param bwOptions
 * @returns
 */
function browserWindowAssembly(
  customize: Customize,
  bwOptions: BrowserWindowConstructorOptions = {}
) {
  if (!customize) throw new Error('not customize');
  bwOptions.minWidth = bwOptions.minWidth || bwOptions.width || windowCfg.opt.width;
  bwOptions.minHeight = bwOptions.minHeight || bwOptions.height || windowCfg.opt.height;
  bwOptions.width = bwOptions.width || windowCfg.opt.width;
  bwOptions.height = bwOptions.height || windowCfg.opt.height;
  // darwin下modal会造成整个窗口关闭(?)
  if (process.platform === 'darwin') delete bwOptions.modal;
  customize.headNative = customize.headNative || false;
  customize.isPackaged = app.isPackaged;
  let bwOpt: BrowserWindowConstructorOptions = Object.assign(bwOptions, {
    autoHideMenuBar: true,
    titleBarStyle: customize.headNative ? 'default' : 'hidden',
    minimizable: true,
    maximizable: true,
    frame: customize.headNative,
    show: customize.headNative,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !app.isPackaged,
      webSecurity: false,
      webviewTag: !customize.headNative && customize.url
    }
  });
  const isParentId =
    customize.parentId !== null &&
    customize.parentId !== undefined &&
    typeof customize.parentId === 'number';
  let parenWin: BrowserWindow | null = null;
  isParentId && (parenWin = Window.getInstance().get(customize.parentId as number));
  if (parenWin) {
    bwOpt.parent = parenWin;
    const currentWH = bwOpt.parent.getBounds();
    customize.currentWidth = currentWH.width;
    customize.currentHeight = currentWH.height;
    customize.currentMaximized = bwOpt.parent.isMaximized();
    if (customize.currentMaximized) {
      const displayWorkAreaSize = screen.getPrimaryDisplay().workAreaSize;
      bwOpt.x = ((displayWorkAreaSize.width - (bwOpt.width || 0)) / 2) | 0;
      bwOpt.y = ((displayWorkAreaSize.height - (bwOpt.height || 0)) / 2) | 0;
    } else {
      const currentPosition = bwOpt.parent.getPosition();
      bwOpt.x =
        (currentPosition[0] + (currentWH.width - (bwOpt.width || customize.currentWidth)) / 2) | 0;
      bwOpt.y =
        (currentPosition[1] + (currentWH.height - (bwOpt.height || customize.currentHeight)) / 2) |
        0;
    }
  }

  return { bwOpt, isParentId, parenWin };
}

/**
 * 窗口打开预处理
 */
function windowOpenHandler(webContents: WebContents, parentId?: number) {
  webContents.setWindowOpenHandler(({ url }) => {
    Window.getInstance().create({
      url,
      parentId
    });
    return { action: 'deny' };
  });
}

/**
 * 窗口加载
 */
function load(url: string, win: BrowserWindow) {
  // 窗口内创建拦截
  windowOpenHandler(win.webContents);
  win.webContents.on('did-attach-webview', (_, webContents) =>
    windowOpenHandler(webContents, win.id)
  );
  win.webContents.on('did-finish-load', () => win.webContents.send('window-load', win.customize));
  // 窗口最大最小监听
  win.on('maximize', () => win.webContents.send('window-maximize-status', 'maximize'));
  win.on('unmaximize', () => win.webContents.send('window-maximize-status', 'unmaximize'));
  // 聚焦失焦监听
  win.on('blur', () => win.webContents.send('window-blur-focus', 'blur'));
  win.on('focus', () => win.webContents.send('window-blur-focus', 'focus'));

  if (url.startsWith('https://') || url.startsWith('http://')) {
    win.loadURL(url, win.customize.loadOptions as LoadURLOptions);
    return;
  }
  win.loadFile(url, win.customize.loadOptions as LoadFileOptions);
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
    let win: BrowserWindow | null = null;
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
  create(customize: Customize, bwOptions: BrowserWindowConstructorOptions = {}) {
    if (customize.isOneWindow && !customize.url) {
      for (const i of this.getAll()) {
        if (customize?.route && customize.route === i.customize?.route) {
          i.focus();
          return;
        }
      }
    }
    const { bwOpt, isParentId, parenWin } = browserWindowAssembly(customize, bwOptions);
    const win = new BrowserWindow(bwOpt);
    //win32 取消原生窗口右键事件
    process.platform === 'win32' &&
      win.hookWindowMessage(278, () => {
        win.setEnabled(false);
        win.setEnabled(true);
      });
    //子窗体关闭父窗体获焦 https://github.com/electron/electron/issues/10616
    isParentId && win.once('close', () => parenWin?.focus());

    !customize.argv && (customize.argv = process.argv);
    customize.id = win.id;
    win.customize = customize;

    // 路由 > url
    if (!app.isPackaged) {
      //调试模式
      try {
        import('fs').then(({ readFileSync }) => {
          win.webContents.openDevTools({ mode: 'detach' });
          let url = `http://localhost:${readFileSync(join('.port'), 'utf8')}`;
          if (win.customize.url) {
            win.customize.headNative && (url = win.customize.url);
            !win.customize.headNative && (win.customize.route = '/Webview');
          }
          load(url, win);
        });
      } catch (e) {
        throw 'not found .port';
      }
      return;
    }
    let url = join(__dirname, '../renderer/index.html');
    if (win.customize.url) {
      win.customize.headNative && (url = win.customize.url);
      !win.customize.headNative && (win.customize.route = '/Webview');
    }
    load(url, win);
  }

  /**
   * 窗口关闭、隐藏、显示等常用方法
   */
  func(type: WindowFuncOpt, id?: number, data?: any[]) {
    if (id !== null && id !== undefined) {
      const win = this.get(id as number);
      if (!win) {
        console.error(`not found win -> ${id}`);
        return;
      }
      // @ts-ignore
      data ? win[type](...data) : win[type]();
      return;
    }
    // @ts-ignore
    if (data) for (const i of this.getAll()) i[type](...data);
    else for (const i of this.getAll()) i[type]();
  }

  /**
   * 窗口发送消息
   */
  send(key: string, value: any, id?: number) {
    if (id !== null && id !== undefined) {
      const win = this.get(id as number);
      if (win) win.webContents.send(key, value);
    } else for (const i of this.getAll()) i.webContents.send(key, value);
  }

  /**
   * 窗口状态
   */
  getStatus(type: WindowStatusOpt, id: number) {
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
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    const workAreaSize = args.size[0]
      ? { width: args.size[0], height: args.size[1] }
      : screen.getPrimaryDisplay().workAreaSize;
    win.setMaximumSize(workAreaSize.width, workAreaSize.height);
  }

  /**
   * 设置窗口最大大小
   */
  setMaxSize(args: { id: number; size: number[] }) {
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    win.setMaximumSize(args.size[0], args.size[1]);
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
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
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
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    win.setBackgroundColor(args.color);
  }

  /**
   * 设置窗口是否置顶
   */
  setAlwaysOnTop(args: { id: number; is: boolean; type?: WindowAlwaysOnTopOpt }) {
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    win.setAlwaysOnTop(args.is, args.type || 'normal');
  }

  /**
   * 开启监听
   */
  on() {
    // 窗口数据更新
    ipcMain.on('window-update', (event, args) => {
      if (args?.id) {
        const win = this.get(args.id);
        if (!win) {
          console.error('Invalid id, the id can not be a empty');
          return;
        }
        win.customize = args;
      }
    });
    // 最大化最小化窗口
    ipcMain.on('window-max-min-size', (event, id) => {
      if (id !== null && id !== undefined) {
        const win = this.get(id);
        if (!win) {
          console.error('Invalid id, the id can not be a empty');
          return;
        }
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
      }
    });
    // 窗口消息
    ipcMain.on('window-func', (event, args) => this.func(args.type, args.id, args.data));
    // 窗口状态
    ipcMain.handle('window-status', async (event, args) => this.getStatus(args.type, args.id));
    // 创建窗口
    ipcMain.on('window-new', (event, args) => this.create(args.customize, args.opt));
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
