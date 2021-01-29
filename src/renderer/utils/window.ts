import {ipcRenderer} from "electron";
import {WindowOpt} from "@/lib/interface";

/**
 * 创建窗口
 */
export function createWindow(data: WindowOpt) {
    let args: WindowOpt = {
        title: data.title,
        width: data.width || 0,
        height: data.height || 0,
        route: data.route, // 页面路由
        resizable: data.resizable || false,// 是否支持调整窗口大小
        backgroundColor: data.backgroundColor || null,//窗口背景色
        data: data.data, //数据
        isMultiWindow: data.isMultiWindow || false, //是否支持多窗口
        isMainWin: data.isMainWin || false, //是否主窗口
        modal: data.modal || false //父窗口置顶
    };
    if (data.parentId) args.parentId = data.parentId;
    ipcRenderer.send("window-new", args);
}

/**
 * 窗口显示
 */
export function windowShow(id?: number) {
    ipcRenderer.send("window-show", id);
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
 * 设置窗口背景颜色
 */
export function setBackgroundColor(id: number, color?: string) {
    ipcRenderer.send("window-bg-color-set", {id, color});
}
