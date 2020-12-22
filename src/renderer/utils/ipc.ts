import {ipcRenderer, remote} from "electron";
import {setMessageData} from "../store";
import {IpcMsg, WindowOpt} from "@/lib/interface";

/**
 * 渲染进程初始化 (i)
 * */
export async function Init() {
    messageBack();
    return new Promise(resolve => ipcRenderer.once("window-load", async (event, args) => resolve(args)))
}

/**
 * 消息反馈
 */
export function messageBack() {
    ipcRenderer.on("message-back", (event, args) => setMessageData(args.key, args.value));
}

/**
 * 消息发送
 */
export function messageSend(args: IpcMsg) {
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
            return resolve(0);
        }
        remote.getCurrentWindow().once("resize", () => {
            if (center) remote.getCurrentWindow().center();
            resolve(0);
        });
        remote.getCurrentWindow().setBounds(Rectangle);
    })
}

/**
 * 创建窗口
 */
export function createWindow(data: WindowOpt) {
    let args: WindowOpt = {
        currentWidth: remote.getCurrentWindow().getBounds().width,
        currentHeight: remote.getCurrentWindow().getBounds().height,
        width: data.width || null,
        height: data.height || null,
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

/**
 * 检查更新 (注: 只需调用一次,多次调用会造成更新模块多次监听)
 */
export function updateCheck() {
    ipcRenderer.send("update-check");
}

/**
 * 重新检查更新
 * @param isDel 是否删除历史更新缓存
 */
export function updateReCheck(isDel: boolean) {
    ipcRenderer.send("update-recheck", isDel);
}

/**
 * 关闭程序进行更新
 * @param isSilent 是否静默更新
 */
export function updateQuitInstall(isSilent: boolean) {
    ipcRenderer.send("update-quit-install", isSilent);
}