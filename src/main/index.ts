import { resolve } from 'path';
import { app, globalShortcut, ipcMain } from 'electron';
import { IPC_MSG_TYPE } from '@/lib/interface';
import { getExternPath } from '@/lib';
import { readFile } from '@/lib/file';
import { Log } from './modular/log';
import { Session } from './modular/session';
import { Window } from './modular/window';
import { Update } from './modular/update';
import { Socket } from './modular/socket';
import { Platform } from './platform';

declare global {
    namespace NodeJS {
        interface Global {
            sharedObject: { [key: string]: any };
        }
    }
}

/**
 * 初始定义
 */
global.sharedObject = {
    isPackaged: app.isPackaged, //是否打包
    platform: process.platform, //当前运行平台
    appInfo: {
        //应用信息
        name: app.name,
        version: app.getVersion()
    }
};

class Init {
    private log = new Log();
    private window = new Window();
    private socket = new Socket();
    private update = new Update();
    private session = new Session();

    constructor() {
    }

    /**
     * 初始化并加载
     * */
    async init() {
        //协议调起
        let args = [];
        if (!app.isPackaged) args.push(resolve(process.argv[1]));
        args.push('--');
        if (!app.isDefaultProtocolClient(app.name, process.execPath, args)) app.setAsDefaultProtocolClient(app.name, process.execPath, args);
        app.allowRendererProcessReuse = true;

        if (!app.requestSingleInstanceLock()) {
            app.quit();
        } else {
            app.on('second-instance', () => {
                // 当运行第二个实例时,将会聚焦到main窗口
                if (this.window.main) {
                    if (this.window.main.isMinimized()) this.window.main.restore();
                    this.window.main.focus();
                }
            });
        }

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (this.window.getAllWindows().length === 0) {
                this.window.createWindow({ isMainWin: true });
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
        /**
         * app重启
         */
        ipcMain.on('app-relaunch', () => {
            app.relaunch({ args: process.argv.slice(1) });
        });
        //app常用获取路径
        ipcMain.on('app-path-get', (event, args) => {
            event.returnValue = app.getPath(args.key);
        });

        //启动
        await Promise.all([this.global(), app.whenReady()]);

        //模块、创建窗口、托盘
        this.modular();
        this.window.createWindow({ isMainWin: true });
        this.window.createTray();
    }

    /**
     * 初始全局变量加载
     */
    async global() {
        try {
            const setting = await readFile(getExternPath('setting.json'));
            global.sharedObject['setting'] = JSON.parse(setting as string);
        } catch (e) {
            this.log.error('[setting]', e);
            global.sharedObject['setting'] = {};
        }
        Platform[global.sharedObject.platform]();

        /**
         * 全局变量赋值
         * 返回1代表完成
         */
        ipcMain.on('global-sharedObject-set', (event, args) => {
            global.sharedObject[args.key] = args.value;
            event.returnValue = 1;
        });
        ipcMain.on('global-sharedObject-get', (event, args) => {
            event.returnValue = global.sharedObject[args.key];
        });
    }

    /**
     * 模块
     * */
    modular() {
        /**
         * 消息反馈(根据需要增加修改)
         */
        ipcMain.on('message-send', (event, args) => {
            switch (args.type) {
                case IPC_MSG_TYPE.WIN: //window模块
                    for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).webContents.send('message-back', args);
                    break;
                case IPC_MSG_TYPE.SOCKET: //socket模块
                    if (this.socket.io && this.socket.io.io._readyState === 'open') this.socket.io.send(args);
                    break;
            }
        });

        /**
         * 开启模块监听
         */
        this.log.on();
        this.window.on();
        this.session.on();
        this.socket.on(this.window);
        this.update.on(this.window);
    }
}

/**
 * 启动
 * */
new Init().init().then();
