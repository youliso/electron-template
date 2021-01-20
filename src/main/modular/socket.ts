import Log from "@/lib/log";
import {io, Socket as SocketIo} from "socket.io-client";
import {ManagerOptions} from "socket.io-client/build/manager";
import {SocketOptions} from "socket.io-client/build/socket";
import {ipcMain} from "electron";
import {Window} from "@/main/modular/window";
import {isNull} from "@/lib";

const config = require("@/cfg/config.json");

/**
 * Socket模块
 * */
export class Socket {
    public io: SocketIo;

    /**
     * socket.io参数
     * 参考 ManagerOptions & SocketOptions
     * url https://socket.io/docs/v3/client-api/#new-Manager-url-options
     */
    public opts: Partial<ManagerOptions & SocketOptions> = {
        auth: {
            authorization: global.sharedObject["authorization"]
        },
    };

    constructor() {
    }

    /**
     * 开启通讯
     */
    open(callback: Function) {
        this.io = io(config.socketUrl, this.opts);
        this.io.on("connect", () => {
            Log.info("[Socket]connect");
        });
        this.io.on("disconnect", () => {
            Log.info("[Socket]disconnect");
            setTimeout(() => {
                if (this.io && this.io.io._readyState === "closed") this.io.open()
            }, 1000 * 60 * 3)
        });
        this.io.on("message", (data: { key: string; value: any; }) => callback(data));
        this.io.on("error", (data: any) => Log.info(`[Socket]error ${data.toString()}`));
        this.io.on("close", () => Log.info("[Socket]close"));
    }

    /**
     * 重新连接
     */
    reconnection() {
        if (this.io && this.io.io._readyState === "closed") this.io.open();
    }

    /**
     * 关闭
     */
    close() {
        if (this.io && this.io.io._readyState !== "closed") this.io.close();
    }

    /**
     * 开启监听
     */
    on(window: Window) {
        //设置opts
        ipcMain.on("socket-set-opts", async (event, args) => this.opts = args);
        //重新连接
        ipcMain.on("socket-reconnection", async () => this.reconnection());
        //关闭
        ipcMain.on("socket-reconnection", async () => this.close());
        //打开socket
        ipcMain.on("socket-open", async () => {
            if (isNull(this.io)) {
                this.open((data: { key: string; value: any; }) => {
                    for (let i in window.group) {
                        if (window.group[i]) {
                            window.getWindow(Number(i)).webContents.send("message-back", data);
                        }
                    }
                });
            }
        });
    }

}
