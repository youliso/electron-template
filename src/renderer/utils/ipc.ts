import {ipcRenderer, remote} from "electron";
import {addMessageData} from "../store";

/**
 * 渲染进程初始化 (i)
 * */
export async function Init() {
    ipcRenderer.on("message-back", (event, args: IpcMessageOpt) => addMessageData(args.key, args.value)); //消息反馈 (i)
    return new Promise(resolve => ipcRenderer.once("window-load", async (event, args) => resolve(JSON.parse(decodeURIComponent(args)))))
}

/**
 * 消息发送
 */
export function send(args: IpcMessageOpt) {
    ipcRenderer.send("message-send", args);
}

/**
 * 设置窗口大小
 */
export function setBounds(size: number[], center?: boolean) {
    return new Promise(resolve => {
        let Rectangle = {
            width: parseInt(size[0].toString()),
            height: parseInt(size[1].toString()),
            x: parseInt((remote.getCurrentWindow().getPosition()[0] + ((remote.getCurrentWindow().getBounds().width - size[0]) / 2)).toString()),
            y: parseInt((remote.getCurrentWindow().getPosition()[1] + ((remote.getCurrentWindow().getBounds().height - size[1]) / 2)).toString())
        };
        if (Rectangle.width === remote.getCurrentWindow().getBounds().width &&
            Rectangle.height === remote.getCurrentWindow().getBounds().height) {
            resolve();
            return;
        }
        remote.getCurrentWindow().once("resize", () => {
            if (center) remote.getCurrentWindow().center();
            resolve();
        });
        remote.getCurrentWindow().setBounds(Rectangle);
    })
}

/**
 * 创建窗口
 */
export function createWindow(data: WindowOpt) {
    let args: WindowOpt = {
        width: data.width || remote.getCurrentWindow().getBounds().width,
        height: data.height || remote.getCurrentWindow().getBounds().height,
        route: data.route, // 页面路由
        resizable: false,// 是否支持调整窗口大小
        data: data.data, //数据
        isMultiWindow: false, //是否支持多窗口
        isMainWin: false, //是否主窗口
        modal: true //父窗口置顶
    };
    if (data.isMultiWindow) args.isMultiWindow = data.isMultiWindow;
    if (data.isMainWin) args.isMainWin = data.isMainWin;
    if (data.parentId) args.parentId = data.parentId;
    if (data.modal) args.modal = data.modal;
    if (data.resizable) args.resizable = data.resizable;
    ipcRenderer.send("window-new", args);
}

/**
 * 关闭窗口 (传id则关闭对应窗口否则退出程序)
 */
export function closeWindow(id?: number) {
    ipcRenderer.send("closed", id);
}

/**
 * socket 初始化
 */
export function socketInit() {
    ipcRenderer.send("socket-init");
}

/**
 * socket 重连
 */
export function socketReconnection() {
    ipcRenderer.send("socket-reconnection");
}

/**
 * 设置全局参数
 */
export function sendGlobal(key: string, value: unknown) {
    ipcRenderer.send("global-sharedObject", {key, value});
}

/**
 * 获取全局参数
 */
export function getGlobal(key: string) {
    return remote.getGlobal("sharedObject")[key];
}



