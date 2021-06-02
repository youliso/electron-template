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
import ico from '../assets/tray.png';
import { isNull } from '@/lib';

const config = require('@/cfg/index.json');

export class Window {
  private static instance: Window;

  public main: BrowserWindow = null; //当前主页
  public group: { [id: number]: WindowOpt } = {}; //窗口组
  public tray: Tray = null; //托盘

  static getInstance() {
    if (!Window.instance) Window.instance = new Window();
    return Window.instance;
  }

  constructor() {}

  /**
   * 窗口配置
   * */
  browserWindowOpt(wh: number[]): BrowserWindowConstructorOptions {
    return {
      minWidth: wh[0],
      minHeight: wh[1],
      width: wh[0],
      height: wh[1],
      backgroundColor: config.appBackgroundColor,
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
  getWindow(id: number) {
    return BrowserWindow.fromId(id);
  }

  /**
   * 获取全部窗口
   */
  getAllWindows() {
    return BrowserWindow.getAllWindows();
  }

  /**
   * 创建窗口
   * */
  createWindow(args: WindowOpt) {
    for (let i in this.group) {
      if (
        !isNull(this.group[i]) &&
        this.group[i].route === args.route &&
        !this.group[i].isMultiWindow
      ) {
        this.getWindow(Number(i)).focus();
        return;
      }
    }
    let opt = this.browserWindowOpt([args.width || config.appW, args.height || config.appH]);
    if (args.parentId) {
      opt.parent = this.getWindow(args.parentId);
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
  createTray() {
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
          if (this.getWindow(id)) this.getWindow(id).close();
          return;
        }
        for (let i in this.group) if (this.getWindow(Number(i))) this.getWindow(Number(i)).close();
        break;
      case 'hide':
        if (!isNull(id)) {
          if (this.getWindow(id)) this.getWindow(id).hide();
          return;
        }
        for (let i in this.group) if (this.getWindow(Number(i))) this.getWindow(Number(i)).hide();
        break;
      case 'show':
        if (!isNull(id)) {
          if (this.getWindow(id)) this.getWindow(id).show();
          return;
        }
        for (let i in this.group) if (this.getWindow(Number(i))) this.getWindow(Number(i)).show();
        break;
      case 'minimize':
        if (!isNull(id)) {
          if (this.getWindow(id)) this.getWindow(id).minimize();
          return;
        }
        for (let i in this.group)
          if (this.getWindow(Number(i))) this.getWindow(Number(i)).minimize();
        break;
      case 'maximize':
        if (!isNull(id)) {
          if (this.getWindow(id)) this.getWindow(id).maximize();
          return;
        }
        for (let i in this.group)
          if (this.getWindow(Number(i))) this.getWindow(Number(i)).maximize();
        break;
      case 'restore':
        if (!isNull(id)) {
          if (this.getWindow(id)) this.getWindow(id).restore();
          return;
        }
        for (let i in this.group)
          if (this.getWindow(Number(i))) this.getWindow(Number(i)).restore();
        break;
      case 'reload':
        if (!isNull(id)) {
          if (this.getWindow(id)) this.getWindow(id).reload();
          return;
        }
        for (let i in this.group) if (this.getWindow(Number(i))) this.getWindow(Number(i)).reload();
        break;
    }
  }

  /**
   * 窗口发送消息
   */
  windowSend(key: string, value: any, id?: number) {
    if (!isNull(id)) {
      this.getWindow(id).webContents.send(key, value);
      return;
    }
    for (let i in this.group)
      if (this.getWindow(Number(i))) this.getWindow(Number(i)).webContents.send(key, value);
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
        return this.getWindow(id).isMaximized();
      case 'isMinimized':
        return this.getWindow(id).isMinimized();
      case 'isFullScreen':
        return this.getWindow(id).isFullScreen();
      case 'isAlwaysOnTop':
        return this.getWindow(id).isAlwaysOnTop();
      case 'isVisible':
        return this.getWindow(id).isVisible();
      case 'isFocused':
        return this.getWindow(id).isFocused();
      case 'isModal':
        return this.getWindow(id).isModal();
    }
  }

  /**
   * 设置窗口最小大小
   */
  setMinSize(args: { id: number; size: number[] }) {
    this.getWindow(args.id).setMinimumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口最大大小
   */
  setMaxSize(args: { id: number; size: number[] }) {
    this.getWindow(args.id).setMaximumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口大小
   */
  setSize(args: { id: number; size: number[]; resizable: boolean; center: boolean }) {
    let Rectangle: { [key: string]: number } = {
      width: parseInt(args.size[0].toString()),
      height: parseInt(args.size[1].toString())
    };
    let window = this.getWindow(args.id);
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
  setBackgroundColor(args: { id: number; color: string }) {
    this.getWindow(args.id).setBackgroundColor(args.color || config.appBackgroundColor);
  }

  /**
   * 设置窗口是否置顶
   */
  setAlwaysOnTop(args: {
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
    this.getWindow(args.id).setAlwaysOnTop(args.is, args.type || 'normal');
  }

  /**
   * 开启监听
   */
  on() {
    //最大化最小化窗口
    ipcMain.on('window-max-min-size', (event, winId) => {
      if (winId)
        if (this.getWindow(winId).isMaximized()) this.getWindow(winId).unmaximize();
        else this.getWindow(winId).maximize();
    });
    //窗口消息
    ipcMain.on('window-fun', (event, args) => this.windowFun(args.type, args.id));
    //窗口状态
    ipcMain.handle('window-status', (event, args) => this.windowStatus(args.type, args.id));
    //创建窗口
    ipcMain.on('window-new', (event, args) => this.createWindow(args));
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
      if (!isNull(args.acceptId)) {
        if (this.getWindow(Number(args.acceptId)))
          this.getWindow(Number(args.acceptId)).webContents.send(channel, args.value);
        return;
      }
      if (args.isback) {
        for (let i in this.group) {
          if (this.getWindow(Number(i)))
            this.getWindow(Number(i)).webContents.send(channel, args.value);
        }
      } else {
        for (let i in this.group) {
          if (this.getWindow(Number(i)) && Number(i) !== args.id)
            this.getWindow(Number(i)).webContents.send(channel, args.value);
        }
      }
    });
  }
}

export default Window.getInstance();
