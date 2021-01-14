import {ipcRenderer} from "electron";
import {setMessageData} from "../store";
import {IpcMsg, WindowOpt} from "@/lib/interface";

/**
 * 渲染进程初始化 (i)
 * */
export async function windowLoad() {
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
export function setSize(id: number, size: number[], center: boolean = false) {
    ipcRenderer.send("window-size-set", {id, size, center});
}

/**
 * 设置窗口最小大小
 */
export function setMinSize(id: number, size: number[]) {
    ipcRenderer.send("window-min-size-set", {id, size});
}

/**
 * 设置窗口最小大小
 */
export function setMaxSize(id: number, size: number[]) {
    ipcRenderer.send("window-max-size-set", {id, size});
}

/**
 * 创建窗口
 */
export function createWindow(data: WindowOpt) {
    let args: WindowOpt = {
        width: data.width || 0,
        height: data.height || 0,
        route: data.route, // 页面路由
        resizable: data.resizable || false,// 是否支持调整窗口大小
        data: data.data, //数据
        isMultiWindow: data.isMultiWindow || false, //是否支持多窗口
        isMainWin: data.isMainWin || false, //是否主窗口
        modal: data.modal || false //父窗口置顶
    };
    if (data.parentId) args.parentId = data.parentId;
    ipcRenderer.send("window-new", args);
}

/**
 * 最大化&最小化当前窗口
 */
export function maxMinWindow(id: number) {
    ipcRenderer.send("window-max-min-size", id);
}

/**
 * 最小化窗口 (传id则对应窗口否则全部窗口)
 */
export function minWindow(id?: number) {
    ipcRenderer.send("window-mini", id);
}

/**
 * 最大化窗口 (传id则对应窗口否则全部窗口)
 */
export function maxWindow(id?: number) {
    ipcRenderer.send("window-max", id);
}

/**
 * 关闭窗口 (传id则对应窗口否则全部窗口)
 */
export function closeWindow(id?: number) {
    ipcRenderer.send("window-closed", id);
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

/**
 * 发送ipc消息
 * @param key
 * @param value
 */
export function ipcSend(key: string, value?: unknown) {
    ipcRenderer.send(key, value);
}