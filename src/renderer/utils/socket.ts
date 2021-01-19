import {ipcRenderer} from "electron";

/**
 * socket 打开 (注: 只需调用一次,多次调用会造成socket模块多次监听)
 */
export function socketOpen() {
    ipcRenderer.send("socket-open");
}

/**
 * socket 重连
 */
export function socketReconnection() {
    ipcRenderer.send("socket-reconnection");
}

/**
 * socket 关闭
 */
export function socketClose() {
    ipcRenderer.send("socket-close");
}