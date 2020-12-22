import Log from "@/lib/log";
import {io, Socket} from "socket.io-client";

const config = require("@/lib/cfg/config.json");

/**
 * Socket模块
 * */
export class Sockets {
    public io: Socket;

    constructor() {
    }

    /**
     * 打开通讯
     * @param callback
     */
    open(callback: Function) {
        this.io = io(config.socketUrl, {query: `Authorization=${global.sharedObject["Authorization"]}`});
        this.io.on("connect", () => {
            Log.info("[Socket]connect");
        });
        this.io.on("disconnect", () => {
            Log.info("[Socket]disconnect");
            setTimeout(() => {
                if (this.io && this.io.io._readyState === "closed") this.io.open()
            }, 1000 * 60 * 3)
        });
        this.io.on("message", (data: any) => callback(data));
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
}
