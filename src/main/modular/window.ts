import { join } from 'path';
import { readFileSync } from 'fs';
import {
  app,
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Menu,
  Tray,
  nativeImage,
  ipcMain
} from 'electron';
import { windowFunOpt, WindowOpt, windowStatusOpt } from '@/lib/interface';
import ico from '@/lib/assets/tray.png';
import { isNull } from '@/lib';

const { appBackgroundColor, appW, appH } = require('@/cfg/index.json');

export class Window {
  private static instance: Window;

  public main: BrowserWindow = null; //当前主页
  public group: { [id: number]: WindowOpt } = {}; //窗口组
  public tray: Tray = null; //托盘

  static getInstance() {
    if (!Window.instance) Window.instance = new Window();
    return Window.instance;
  }

  constructor() {
  }

  /**
   * 窗口配置
   * */
  browserWindowOpt(wh: number[]): BrowserWindowConstructorOptions {
    return {
      minWidth: wh[0],
      minHeight: wh[1],
      width: wh[0],
      height: wh[1],
      backgroundColor: appBackgroundColor,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden',
      resizable: true,
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
    };
  }

  /**
   * 获取窗口
   * @param id 窗口id
   * @constructor
   */
  windowGet(id: number) {
    return BrowserWindow.fromId(id);
  }

  /**
   * 获取全部窗口
   */
  windowsAllGet() {
    return BrowserWindow.getAllWindows();
  }

  /**
   * 创建窗口
   * */
  windowCreate(args: WindowOpt) {
    for (let i in this.group) {
      if (
        !isNull(this.group[i]) &&
        this.group[i].route === args.route &&
        !this.group[i].isMultiWindow
      ) {
        this.windowGet(Number(i)).focus();
        return;
      }
    }
    let opt = this.browserWindowOpt([args.width || appW, args.height || appH]);
    if (args.parentId) {
      opt.parent = this.windowGet(args.parentId);
      args.currentWidth = opt.parent.getBounds().width;
      args.currentHeight = opt.parent.getBounds().height;
      args.currentMaximized = opt.parent.isMaximized();
      if (args.currentMaximized) {
        opt.x = parseInt(
          ((screen.getPrimaryDisplay().workAreaSize.width - (args.width || 0)) / 2).toString()
        );
        opt.y = parseInt(
          ((screen.getPrimaryDisplay().workAreaSize.height - (args.height || 0)) / 2).toString()
        );
      } else {
        opt.x = parseInt(
          (
            opt.parent.getPosition()[0] +
            (opt.parent.getBounds().width - (args.width || args.currentWidth)) / 2
          ).toString()
        );
        opt.y = parseInt(
          (
            opt.parent.getPosition()[1] +
            (opt.parent.getBounds().height - (args.height || args.currentHeight)) / 2
          ).toString()
        );
      }
    } else if (this.main) {
      opt.x = parseInt(
        (this.main.getPosition()[0] + (this.main.getBounds().width - opt.width) / 2).toString()
      );
      opt.y = parseInt(
        (this.main.getPosition()[1] + (this.main.getBounds().height - opt.height) / 2).toString()
      );
    }
    if (typeof args.modal === 'boolean') opt.modal = args.modal;
    if (typeof args.resizable === 'boolean') opt.resizable = args.resizable;
    if (args.backgroundColor) opt.backgroundColor = args.backgroundColor;
    let win = new BrowserWindow(opt);
    this.group[win.id] = {
      route: args.route,
      isMultiWindow: args.isMultiWindow
    };
    if (args.isMainWin) {
      //是否主窗口
      if (this.main && !this.main.isDestroyed()) this.main.close();
      this.main = win;
    }
    args.id = win.id;
    //window加载完毕后显示 (放到vue生命周期执行)
    // win.once("ready-to-show", () => win.show());
    //window关闭前黑底时设置透明并删除引用
    win.on('close', () => {
      delete this.group[win.id];
      win.setOpacity(0);
    });
    // 打开开发者工具
    if (!app.isPackaged) win.webContents.openDevTools();
    //注入初始化代码
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('window-load', args);
    });
    if (!app.isPackaged) {
      //调试模式
      let appPort = '';
      try {
        appPort = readFileSync(join('.port'), 'utf8');
      } catch (e) {
        throw 'not found .port';
      }
      win.loadURL(`http://localhost:${appPort}`).then();
      return;
    }
    win.loadFile(join(__dirname, './index.html')).then();
  }

  /**
   * 创建托盘
   * */
  trayCreate() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示',
        click: () => this.windowFun('show')
      },
      {
        label: '退出',
        click: () => app.quit()
      }
    ]);
    this.tray = new Tray(nativeImage.createFromPath(join(__dirname, `./${ico}`)));
    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip(app.name);
    this.tray.on('double-click', () => this.windowFun('show'));
  }

  /**
   * 窗口关闭、隐藏、显示等常用方法
   */
  windowFun(type: windowFunOpt, id?: number) {
    switch (type) {
      case 'close':
        if (!isNull(id)) {
          if (this.windowGet(id)) this.windowGet(id).close();
          return;
        }
        for (let i in this.group) if (this.windowGet(Number(i))) this.windowGet(Number(i)).close();
        break;
      case 'hide':
        if (!isNull(id)) {
          if (this.windowGet(id)) this.windowGet(id).hide();
          return;
        }
        for (let i in this.group) if (this.windowGet(Number(i))) this.windowGet(Number(i)).hide();
        break;
      case 'show':
        if (!isNull(id)) {
          if (this.windowGet(id)) this.windowGet(id).show();
          return;
        }
        for (let i in this.group) if (this.windowGet(Number(i))) this.windowGet(Number(i)).show();
        break;
      case 'minimize':
        if (!isNull(id)) {
          if (this.windowGet(id)) this.windowGet(id).minimize();
          return;
        }
        for (let i in this.group)
          if (this.windowGet(Number(i))) this.windowGet(Number(i)).minimize();
        break;
      case 'maximize':
        if (!isNull(id)) {
          if (this.windowGet(id)) this.windowGet(id).maximize();
          return;
        }
        for (let i in this.group)
          if (this.windowGet(Number(i))) this.windowGet(Number(i)).maximize();
        break;
      case 'restore':
        if (!isNull(id)) {
          if (this.windowGet(id)) this.windowGet(id).restore();
          return;
        }
        for (let i in this.group)
          if (this.windowGet(Number(i))) this.windowGet(Number(i)).restore();
        break;
      case 'reload':
        if (!isNull(id)) {
          if (this.windowGet(id)) this.windowGet(id).reload();
          return;
        }
        for (let i in this.group) if (this.windowGet(Number(i))) this.windowGet(Number(i)).reload();
        break;
    }
  }

  /**
   * 窗口发送消息
   */
  windowSend(key: string, value: any, id?: number) {
    if (!isNull(id)) {
      this.windowGet(id).webContents.send(key, value);
      return;
    }
    for (let i in this.group)
      if (this.windowGet(Number(i))) this.windowGet(Number(i)).webContents.send(key, value);
  }

  /**
   * 窗口状态
   */
  windowStatus(type: windowStatusOpt, id: number) {
    if (isNull(id)) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    switch (type) {
      case 'isMaximized':
        return this.windowGet(id).isMaximized();
      case 'isMinimized':
        return this.windowGet(id).isMinimized();
      case 'isFullScreen':
        return this.windowGet(id).isFullScreen();
      case 'isAlwaysOnTop':
        return this.windowGet(id).isAlwaysOnTop();
      case 'isVisible':
        return this.windowGet(id).isVisible();
      case 'isFocused':
        return this.windowGet(id).isFocused();
      case 'isModal':
        return this.windowGet(id).isModal();
    }
  }

  /**
   * 设置窗口最小大小
   */
  windowMinSizeSet(args: { id: number; size: number[] }) {
    this.windowGet(args.id).setMinimumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口最大大小
   */
  windowMaxSizeSet(args: { id: number; size: number[] }) {
    this.windowGet(args.id).setMaximumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口大小
   */
  windowSizeSet(args: { id: number; size: number[]; resizable: boolean; center: boolean }) {
    let Rectangle: { [key: string]: number } = {
      width: parseInt(args.size[0].toString()),
      height: parseInt(args.size[1].toString())
    };
    let window = this.windowGet(args.id);
    if (
      Rectangle.width === window.getBounds().width &&
      Rectangle.height === window.getBounds().height
    ) {
      return;
    }
    if (!args.center) {
      Rectangle.x = parseInt(
        (window.getPosition()[0] + (window.getBounds().width - args.size[0]) / 2).toString()
      );
      Rectangle.y = parseInt(
        (window.getPosition()[1] + (window.getBounds().height - args.size[1]) / 2).toString()
      );
    }
    window.once('resize', () => {
      if (args.center) window.center();
    });
    window.setResizable(args.resizable);
    window.setMinimumSize(Rectangle.width, Rectangle.height);
    window.setBounds(Rectangle);
  }

  /**
   * 设置窗口背景色
   */
  windowBackgroundColorSet(args: { id: number; color: string }) {
    this.windowGet(args.id).setBackgroundColor(args.color || appBackgroundColor);
  }

  /**
   * 设置窗口是否置顶
   */
  windowAlwaysOnTopSet(args: {
    id: number;
    is: boolean;
    type?:
      | 'normal'
      | 'floating'
      | 'torn-off-menu'
      | 'modal-panel'
      | 'main-menu'
      | 'status'
      | 'pop-up-menu'
      | 'screen-saver';
  }) {
    this.windowGet(args.id).setAlwaysOnTop(args.is, args.type || 'normal');
  }

  /**
   * 开启监听
   */
  on() {
    //最大化最小化窗口
    ipcMain.on('window-max-min-size', (event, winId) => {
      if (winId)
        if (this.windowGet(winId).isMaximized()) this.windowGet(winId).unmaximize();
        else this.windowGet(winId).maximize();
    });
    //窗口消息
    ipcMain.on('window-fun', (event, args) => this.windowFun(args.type, args.id));
    //窗口状态
    ipcMain.handle('window-status', (event, args) => this.windowStatus(args.type, args.id));
    //创建窗口
    ipcMain.on('window-new', (event, args) => this.windowCreate(args));
    //设置窗口是否置顶
    ipcMain.on('window-always-top-set', (event, args) => this.windowAlwaysOnTopSet(args));
    //设置窗口大小
    ipcMain.on('window-size-set', (event, args) => this.windowSizeSet(args));
    //设置窗口最小大小
    ipcMain.on('window-min-size-set', (event, args) => this.windowMinSizeSet(args));
    //设置窗口最大大小
    ipcMain.on('window-max-size-set', (event, args) => this.windowMaxSizeSet(args));
    //设置窗口背景颜色
    ipcMain.on('window-bg-color-set', (event, args) => this.windowBackgroundColorSet(args));
    //窗口消息
    ipcMain.on('window-message-send', (event, args) => {
      let channel = `window-message-${args.channel}-back`;
      if (!isNull(args.acceptIds) && args.acceptIds.length > 0) {
        for (let i of args.acceptIds) {
          if (this.windowGet(Number(i)))
            this.windowGet(Number(i)).webContents.send(channel, args.value);
        }
        return;
      }
      if (args.isback) {
        for (let i in this.group) {
          if (this.windowGet(Number(i)))
            this.windowGet(Number(i)).webContents.send(channel, args.value);
        }
      } else {
        for (let i in this.group) {
          if (this.windowGet(Number(i)) && Number(i) !== args.id)
            this.windowGet(Number(i)).webContents.send(channel, args.value);
        }
      }
    });
    //通过路由获取窗口id (不传route查全部)
    ipcMain.on('window-id-get', (event, args) => {
      let winIds: number[] = [];
      if (args.route) {
        for (let i in this.group) {
          if (this.group[i].route === args.route) winIds.push(Number(i));
        }
      } else winIds = Object.keys(this.group).map(e => Number(e));
      event.returnValue = winIds;
    });
  }
}

export default Window.getInstance();
