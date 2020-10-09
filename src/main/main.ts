import {resolve, join} from "path";
import {existsSync, readdirSync, statSync, unlinkSync, rmdirSync} from "fs";
import {
    shell,
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    Tray,
    BrowserWindowConstructorOptions, Menu
} from "electron";
import {autoUpdater} from "electron-updater";
import * as Socket from 'socket.io-client';
import ico from "./assets/icon.ico";

const config = require("../cfg/config.json");

declare global {
    namespace NodeJS {
        interface Global {
            sharedObject: { [key: string]: unknown }
        }
    }
}

global.sharedObject = {};

interface DialogBrowserWindow extends BrowserWindow {
    uniQueKey?: string; //父窗口key
    isMultiWindow?: boolean; //是否支持多窗口
}

class Main {
    private static instance: Main;

    private win: BrowserWindow = null; //主窗口
    private dialogs: DialogBrowserWindow[] = []; //弹框组
    private dialogsType: boolean[] = []; //弹框组状态
    private appTray: Tray = null; //托盘
    private menu: BrowserWindow = null; //托盘窗口
    private socket: SocketIOClient.Socket = null; //socket

    static getInstance() {
        if (!Main.instance) Main.instance = new Main();
        return Main.instance;
    }

    constructor() {
    }

    /**
     * 删除目录和内部文件
     * */
    delDir(path: string) {
        let files = [];
        if (existsSync(path)) {
            files = readdirSync(path);
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if (statSync(curPath).isDirectory()) {
                    this.delDir(curPath); //递归删除文件夹
                } else {
                    unlinkSync(curPath); //删除文件
                }
            });
            rmdirSync(path);
        }
    }

    /**
     * 窗口配置
     * */
    browserWindowOpt(wh: number[]): BrowserWindowConstructorOptions {
        return {
            width: wh[0],
            height: wh[1],
            transparent: true,
            autoHideMenuBar: true,
            resizable: false,
            maximizable: false,
            frame: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                devTools: !app.isPackaged,
                webSecurity: false,
                enableRemoteModule: true
            }
        }
    }

    /**
     * 创建主窗口
     * */
    async createWindow() {
        this.win = new BrowserWindow(this.browserWindowOpt([1, 1]));
        // //加载完毕后显示
        this.win.once('ready-to-show', () => this.win.show());
        //关闭后，这个事件会被触发。
        this.win.on('closed', () => {
            this.win = null;
        });
        //调整窗口大小后触发
        this.win.on('resize', () => {
            this.win.webContents.send('window-resize');
        });
        //默认浏览器打开跳转连接
        this.win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        // 打开开发者工具
        if (!app.isPackaged) this.win.webContents.openDevTools();
        //注入初始化代码
        this.win.webContents.on("did-finish-load", () => {
            this.win.webContents.send('window-load', encodeURIComponent(JSON.stringify({el: 'app'})));
        });
        // 加载index.html文件
        if (!app.isPackaged) await this.win.loadURL(`http://localhost:${config.appPort}`).catch(err => console.error(err));
        else await this.win.loadFile(join(__dirname, './index.html')).catch(err => console.error(err));
    }

    /**
     * 创建托盘
     * */
    async createTray() {
        try {
            const contextMenu = Menu.buildFromTemplate([{
                label: '显示',
                click: () => {
                    for (let i of this.dialogs) if (i) i.show();
                    this.win.show();
                }
            }, {
                label: '退出',
                click: () => {
                    app.quit();
                }
            }]);
            this.appTray = new Tray(join(__dirname, `./${ico}`));
            this.appTray.setContextMenu(contextMenu);
            this.appTray.setToolTip(app.name);
            this.appTray.on('double-click', () => {
                for (let i of this.dialogs) if (i) i.show();
                this.win.show();
            })
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 创建弹框
     * */
    async createDialog(args: DialogOpt) {
        let id = this.dialogs.length;
        for (let i of this.dialogs) {
            if (i && i.uniQueKey === args.uniQueKey && !i.isMultiWindow) {
                i.focus();
                return;
            }
        }
        //创建一个与父类窗口同大小、坐标的窗口
        let opt = this.browserWindowOpt([args.width, args.height]);
        if (typeof args.parent === 'string') {
            if (args.parent === 'win') opt.parent = this.win;
            opt.x = this.win.getPosition()[0] //+ ((this.win.getBounds().width - args.width) / 2);
            opt.y = this.win.getPosition()[1] //+ ((this.win.getBounds().height - args.height) / 2);
        } else if (typeof args.parent === 'number') {
            opt.parent = this.dialogs[args.parent];
            opt.x = this.dialogs[args.parent].getPosition()[0] //+ ((this.dialogs[args.parent].getBounds().width - args.width) / 2);
            opt.y = this.dialogs[args.parent].getPosition()[1] //+ ((this.dialogs[args.parent].getBounds().height - args.height) / 2);
        }
        opt.modal = args.modal;
        opt.resizable = args.resizable;
        this.dialogs[id] = new BrowserWindow(opt);
        this.dialogs[id].uniQueKey = args.uniQueKey;
        this.dialogs[id].isMultiWindow = args.isMultiWindow;
        // //window加载完毕后显示
        this.dialogs[id].once('ready-to-show', () => this.dialogs[id].show());
        //window被关闭，这个事件会被触发。
        this.dialogs[id].on('closed', () => {
            this.dialogs[id] = null;
        });
        //调整窗口大小后触发
        this.dialogs[id].on('resize', () => {
            this.dialogs[id].webContents.send('window-resize');
        });
        //默认浏览器打开跳转连接
        this.dialogs[id].webContents.on('new-window', (event, url, frameName, disposition, options) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        // 打开开发者工具
        if (!app.isPackaged) this.dialogs[id].webContents.openDevTools();
        //注入初始化代码
        this.dialogs[id].webContents.on("did-finish-load", () => {
            args.id = id;
            this.dialogs[id].webContents.send('window-load', encodeURIComponent(JSON.stringify({
                el: 'dialog',
                data: args
            })));
        });
        if (!app.isPackaged) await this.dialogs[id].loadURL(`http://localhost:${config.appPort}`).catch(err => console.error(err));
        else await this.dialogs[id].loadFile(join(__dirname, './index.html')).catch(err => console.error(err));
        this.dialogsType[id] = true;
    }

    /**
     * 创建Socket
     * */
    async createSocket(Authorization: string) {
        this.socket = Socket.connect(config.socketUrl, {query: `Authorization=${Authorization}`});
        this.socket.on('connect', () => {
            this.win.webContents.executeJavaScript('console.log(\'[socket]connect\');');
        });
        // @ts-ignore
        this.socket.on('message', data => {
            this.win.webContents.send('message-back', data);
            for (let i of this.dialogs) if (i) i.webContents.send('message-back', data);
        });
        // @ts-ignore
        this.socket.on('error', msg => {
            this.win.webContents.send('message-back', {key: 'socket-error', value: msg});
            for (let i of this.dialogs) if (i) i.webContents.send('message-back', {key: 'socket-error', value: msg});
        });
        this.socket.on('disconnect', () => {
            this.win.webContents.executeJavaScript('console.log(\'[socket]disconnect\');');
            setTimeout(() => {
                if (this.socket && this.socket.io.readyState === 'closed') this.socket.open()
            }, 1000 * 60 * 3)
        });
        this.socket.on('close', () => {
            this.win.webContents.send('message-back', {key: 'socket-close', value: '[socket]close'});
            for (let i of this.dialogs) if (i) i.webContents.send('message-back', {
                key: 'socket-close',
                value: '[socket]close'
            });
        });
    }

    /**
     * 更新模块
     * */
    async update() {
        let message = {
            error: {code: 0, msg: '检查更新出错'},
            checking: {code: 1, msg: '正在检查更新'},
            updateAva: {code: 2, msg: '检测到新版本，正在下载'},
            updateNotAva: {code: 3, msg: '现在使用的就是最新版本，不用更新'}
        };
        // 这里的URL就是更新服务器的放置文件的地址
        autoUpdater.setFeedURL(config.updateFileUrl);
        autoUpdater.on('error', error => {
            this.win.webContents.send('update-message', message.error);
        });
        autoUpdater.on('checking-for-update', () => {
            this.win.webContents.send('update-message', message.checking);
        });
        autoUpdater.on('update-available', (info) => {
            this.win.webContents.send('update-message', message.updateAva);
        });
        autoUpdater.on('update-not-available', (info) => {
            this.win.webContents.send('update-message', message.updateNotAva);
        });
        // 更新下载进度事件
        autoUpdater.on('download-progress', (progressObj) => {
            this.win.webContents.send('download-progress', progressObj)
        })
        // 下载完成事件
        autoUpdater.on('update-downloaded', () => {
            ipcMain.on('update-downloaded', () => {
                // 关闭程序安装新的软件
                autoUpdater.quitAndInstall();
            });
            // 通知渲染进程现在完成
            this.win.webContents.send('update-downloaded');
        });
        //执行自动更新检查
        try {
            await autoUpdater.checkForUpdates();
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 初始化并加载
     * */
    async init() {
        app.allowRendererProcessReuse = true;
        if (!app.requestSingleInstanceLock()) {
            app.quit();
        } else {
            app.on('second-instance', (event, argv, workingDirectory) => {
                // 当运行第二个实例时,将会聚焦到myWindow这个窗口
                if (this.win) {
                    if (this.win.isMinimized()) this.win.restore();
                    this.win.focus();
                }
            })
        }
        app.whenReady().then(() => {
            this.createWindow();
            this.createTray();
        });
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        })
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        })
        //获得焦点时发出
        app.on('browser-window-focus', () => {
            //关闭刷新
            globalShortcut.register('CommandOrControl+R', () => {
            });
        });
        //失去焦点时发出
        app.on('browser-window-blur', () => {
            // 注销快捷键
            globalShortcut.unregister('CommandOrControl+R');
        });
        //协议调起
        let args = [];
        if (!app.isPackaged) args.push(resolve(process.argv[1]));
        args.push('--');
        app.setAsDefaultProtocolClient(app.name, process.execPath, args);
    }

    async ipc() {
        /**
         * 主体
         * */
        //关闭
        ipcMain.on('closed', (event, args) => {
            for (let i of this.dialogs) if (i) i.close();
            this.dialogs = [];
            this.dialogsType = [];
            if (this.menu) this.menu.close();
            this.win.close();
        });
        //隐藏
        ipcMain.on('hide', (event, args) => {
            for (let i of this.dialogs) if (i) i.hide();
            this.win.hide();
        });
        //显示
        ipcMain.on('show', (event, args) => {
            if (args === undefined) {
                for (let i of this.dialogs) if (i) i.show();
                this.win.show();
                return;
            }
            switch (args.type) {
                case 'win':
                    this.win.show();
                    break;
                case 'dialog':
                    this.dialogs[Number(args.id)].show();
                    break;
                case 'menu':
                    this.menu.show();
                    break;
            }

        });
        //最小化
        ipcMain.on('mini', () => {
            for (let i of this.dialogs) if (i) i.minimize();
            this.win.minimize();
        });
        //复原
        ipcMain.on('restore', () => {
            for (let i of this.dialogs) if (i) i.restore();
            this.win.restore();
        });
        //重载
        ipcMain.on('reload', () => {
            for (let i of this.dialogs) if (i) i.reload();
            this.win.reload();
        });
        //重启
        ipcMain.on('relaunch', () => {
            app.relaunch({args: process.argv.slice(1)});
        });

        /**
         * 弹框
         * */
        //创建
        ipcMain.on('dialog-new', (event, args) => {
            this.createDialog(args);
        });
        //关闭
        ipcMain.on('dialog-closed', (event, id) => {
            this.dialogsType[id] = false;
            this.dialogs[id].close();
            delete this.dialogs[id];
            let is = true;
            for (let i = 0, len = this.dialogsType.length; i < len; i++) if (this.dialogsType[i]) is = false;
            if (is) {
                this.dialogs = [];
                this.dialogsType = [];
            }
        });
        //最小化
        ipcMain.on('dialog-mini', (event, id) => {
            this.dialogs[id].minimize();
        });

        /**
         * socket
         * */
        //初始化
        ipcMain.on('socket-init', async (event, Authorization) => {
            if (!this.socket) await this.createSocket(Authorization);
        });
        //重新连接
        ipcMain.on('socket-reconnection', async () => {
            if (this.socket && this.socket.io.readyState === 'closed') this.socket.open();
        });

        /**
         * update
         * */
        //删除更新文件
        ipcMain.on('update-delFile', () => {
            this.delDir(config.updateFilePath);
        });
        //检查更新
        ipcMain.on('update', () => {
            this.update();
        });

        /**
         * 全局变量赋值
         */
        ipcMain.on('globalSharedObject', (event, args) => {
            global.sharedObject[args.key] = args.value;
        });

        /**
         * 消息反馈
         */
        ipcMain.on('message-send', (event, args) => {
            switch (args.type) {
                case 'dialog':
                    for (let i of this.dialogs) if (i) i.webContents.send('message-back', args);
                    this.win.webContents.send('message-back', args);
                    break;
                case 'socket':
                    if (this.socket && this.socket.io.readyState === 'open') this.socket.send(args);
                    break;
            }
        });
    }

}

/**
 * 启动
 * */
(async () => {
    await Main.getInstance().ipc();
    await Main.getInstance().init();
})()
