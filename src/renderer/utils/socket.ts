import { IpcRendererEvent } from 'electron';
import { ManagerOptions } from 'socket.io-client/build/manager';
import { SocketOptions } from 'socket.io-client/build/socket';

/**
 * socket 打开 (注: 只需调用一次,多次调用会造成socket模块多次监听)
 */
export function socketOpen() {
  window.ipcFun.send('socket-open');
}

/**
 * socket 监听 (注: 只需调用一次,多次调用会造成socket模块多次监听)
 */
export function socketOn(listener: (event: IpcRendererEvent, args: any) => void) {
  window.ipcFun.on('socket-back', listener);
}

/**
 * socket 关闭监听
 */
export function socketListenersRemove() {
  window.ipcFun.removeAllListeners('socket-back');
}

/**
 * socket 设置
 */
export function socketSetOpt(args: Partial<ManagerOptions & SocketOptions>) {
  window.ipcFun.send('socket-setopts', args);
}

/**
 * socket 重连
 */
export function socketReconnection() {
  window.ipcFun.send('socket-reconnection');
}

/**
 * socket 关闭
 */
export function socketClose() {
  window.ipcFun.send('socket-close');
}

/**
 * socket 发送
 */
export function socketSend(args: any) {
  window.ipcFun.send('socket-send', args);
}
