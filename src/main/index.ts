import {resolve} from "path";
import {app, globalShortcut, ipcMain} from "electron";
import {IPC_MSG_TYPE, SOCKET_MSG_TYPE} from "@/lib/interface";
import {Window} from "./window";
import {Updates} from "./update";
import {Sockets} from "./socket";

declare global {
    namespace NodeJS {
        interface Global {
            sharedObject: { [key: string]: unknown }
        }
    }
}

global.sharedObject = {};

class Init {

    private window = new Window()
    private socket = new Sockets();
    private updates = new Updates();

    constructor() {
    }

    /**
     * 初始化并加载
     * */
    async init() {
        app.allowRendererProcessReuse = true;
        if (!app.requestSingleInstanceLock()) {
            app.quit();
        } else {
            app.on("second-instance", () => {
                // 当运行第二个实例时,将会聚焦到myWindow这个窗口
                if (this.window.main) {
                    if (this.window.main.isMinimized()) this.window.main.restore();
                    this.window.main.focus();
                }
            })
        }
        app.whenReady().then(() => {
            this.window.createWindow({isMainWin: true});
            this.window.createTray();
        });
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        })
        app.on("activate", () => {
            if (this.window.getAllWindows().length === 0) {
                this.window.createWindow({isMainWin: true});
            }
        })
        //获得焦点时发出
        app.on("browser-window-focus", () => {
            //关闭刷新
            globalShortcut.register("CommandOrControl+R", () => {
            });
        });
        //失去焦点时发出
        app.on("browser-window-blur", () => {
            // 注销关闭刷新
            globalShortcut.unregister("CommandOrControl+R");
        });
        //协议调起
        let args = [];
        if (!app.isPackaged) args.push(resolve(process.argv[1]));
        args.push("--");
        app.setAsDefaultProtocolClient(app.name, process.execPath, args);
    }

    async ipc() {
        /**
         * 主体
         * */
        //关闭
        ipcMain.on("closed", (event, winId) => {
            if (winId) {
                this.window.getWindow(Number(winId)).close();
                if (this.window.group[Number(winId)]) delete this.window.group[Number(winId)];
            } else {
                for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).close();
            }
        });
        //隐藏
        ipcMain.on("hide", (event, winId) => {
            if (winId) {
                this.window.getWindow(Number(winId)).hide();
            } else {
                for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).hide();
            }
        });
        //显示
        ipcMain.on("show", (event, winId) => {
            if (winId) {
                this.window.getWindow(Number(winId)).show();
            } else {
                for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).show();
            }
        });
        //最小化
        ipcMain.on("mini", (event, winId) => {
            if (winId) {
                this.window.getWindow(Number(winId)).minimize();
            } else {
                for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).minimize();
            }
        });
        //复原
        ipcMain.on("restore", (event, winId) => {
            if (winId) {
                this.window.getWindow(Number(winId)).restore();
            } else {
                for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).restore();
            }
        });
        //重载
        ipcMain.on("reload", (event, winId) => {
            if (winId) {
                this.window.getWindow(Number(winId)).reload();
            } else {
                for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).reload();
            }
        });
        //重启
        ipcMain.on("relaunch", () => {
            app.relaunch({args: process.argv.slice(1)});
        });
        //创建窗口
        ipcMain.on("window-new", (event, args) => this.window.createWindow(args));

        /**
         * socket
         * */
        //初始化
        ipcMain.on("socket-open", async () => {
            if (!this.socket) {
                this.socket.open((data: any) => {
                    if (data.type === SOCKET_MSG_TYPE.ERROR) {
                        this.window.createWindow({
                            route: "/message",
                            isMainWin: true,
                            data: {
                                title: "提示",
                                text: data.value
                            },
                        });
                        setTimeout(() => {
                            this.window.closeAllWindow();
                        }, 10000)
                    }
                    for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).webContents.send("message-back", data);
                })
            }
        });
        //重新连接
        ipcMain.on("socket-reconnection", async () => this.socket.reconnection());
        //关闭
        ipcMain.on("socket-reconnection", async () => this.socket.close());

        /**
         * 检查更新
         * */
        //开启更新监听
        ipcMain.on("update-check", () => {
            this.updates.checkForUpdates((data: any) => { //更新消息
                for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).webContents.send("message-back", data);
            })
        });
        //重新检查更新 isDel 是否删除历史更新缓存
        ipcMain.on("update-recheck", (event, isDel) => this.updates.checkUpdate(isDel));
        // 关闭程序安装新的软件 isSilent 是否静默更新
        ipcMain.on("update-quit-install", (event, isSilent) => this.updates.updateQuitInstall(isSilent));

        /**
         * 全局变量赋值
         */
        ipcMain.on("global-sharedObject", (event, args) => global.sharedObject[args.key] = args.value);

        /**
         * 消息反馈
         */
        ipcMain.on("message-send", (event, args) => {
            switch (args.type) {
                case IPC_MSG_TYPE.WIN:
                    for (let i in this.window.group) if (this.window.group[i]) this.window.getWindow(Number(i)).webContents.send("message-back", args);
                    break;
                case IPC_MSG_TYPE.SOCKET:
                    if (this.socket.io && this.socket.io.io._readyState === "open") this.socket.io.send(args);
                    break;
            }
        });
    }

}

/**
 * 启动
 * */
(async () => {
    const app = new Init();
    await app.ipc();
    await app.init();
})()