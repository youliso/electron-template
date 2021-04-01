
/**
 * socket 打开 (注: 只需调用一次,多次调用会造成socket模块多次监听)
 */
export function socketOpen() {
    window.ipcFun.send("socket-open");
}

/**
 * socket 重连
 */
export function socketReconnection() {
    window.ipcFun.send("socket-reconnection");
}

/**
 * socket 关闭
 */
export function socketClose() {
    window.ipcFun.send("socket-close");
}