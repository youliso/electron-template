import {WindowOpt} from "@/lib/interface";

/**
 * 创建窗口
 */
export function windowCreate(args: WindowOpt) {
    window.ipcFun.send("window-new", args);
}

/**
 * 窗口显示
 */
export function windowShow(id?: number) {
    window.ipcFun.send("window-show", id);
}

/**
 * 窗口隐藏
 */
export function windowHide(id?: number) {
    window.ipcFun.send('window-hide', id);
}

/**
 * 窗口置顶
 */
export function windowAlwaysOnTop(id: number, is: boolean, type?: 'normal' | 'floating' | 'torn-off-menu' | 'modal-panel' | 'main-menu' | 'status' | 'pop-up-menu' | 'screen-saver') {
    window.ipcFun.send("window-always-top-set", {id, is, type});
}

/**
 * 最大化&最小化当前窗口
 */
export function windowMaxMin(id: number) {
    window.ipcFun.send("window-max-min-size", id);
}

/**
 * 最小化窗口 (传id则对应窗口否则全部窗口)
 */
export function windowMin(id?: number) {
    window.ipcFun.send("window-mini", id);
}

/**
 * 最大化窗口 (传id则对应窗口否则全部窗口)
 */
export function windowMax(id?: number) {
    window.ipcFun.send("window-max", id);
}

/**
 * 关闭窗口 (传id则对应窗口否则全部窗口)
 */
export function windowClose(id?: number) {
    window.ipcFun.send("window-closed", id);
}

/**
 * 设置窗口大小
 */
export function windowSetSize(id: number, size: number[], resizable: boolean = true, center: boolean = false) {
    window.ipcFun.send("window-size-set", {id, size, resizable, center});
}

/**
 * 设置窗口最小大小
 */
export function windowSetMinSize(id: number, size: number[]) {
    window.ipcFun.send("window-min-size-set", {id, size});
}

/**
 * 设置窗口最小大小
 */
export function windowSetMaxSize(id: number, size: number[]) {
    window.ipcFun.send("window-max-size-set", {id, size});
}

/**
 * 设置窗口背景颜色
 */
export function windowSetBackgroundColor(id: number, color?: string) {
    window.ipcFun.send("window-bg-color-set", {id, color});
}
