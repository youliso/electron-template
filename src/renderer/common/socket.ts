import type { ManagerOptions, SocketOptions } from 'socket.io-client';
import type { IpcRendererEvent } from 'electron';

/**
 * socket 打开 (注: 只需调用一次,多次调用会造成socket模块多次监听)
 */
export function socketOpen() {
  window.ipc.send('socket-open');
}

/**
 * socket 监听 (注: 只需调用一次,多次调用会造成socket模块多次监听)
 */
export function socketOn(listener: (event: IpcRendererEvent, args: any) => void) {
  window.ipc.on('socket-back', listener);
}

/**
 * socket 关闭监听
 */
export function socketListenersRemove() {
  window.ipc.removeAllListeners('socket-back');
}

/**
 * socket 设置
 */
export function socketSetOpt(args: Partial<ManagerOptions & SocketOptions>) {
  window.ipc.send('socket-setopts', args);
}

/**
 * socket 重连
 */
export function socketReconnection() {
  window.ipc.send('socket-reconnection');
}

/**
 * socket 关闭
 */
export function socketClose() {
  window.ipc.send('socket-close');
}

/**
 * socket 发送
 */
export function socketSend(args: any) {
  window.ipc.send('socket-send', args);
}
