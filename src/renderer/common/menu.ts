import type { IpcRendererEvent } from 'electron';

/**
 * 打开menu
 */
export function menuShow() {
  window.ipc.send('menu-show');
}

/**
 * menu 监听反馈
 */
export function menuOn(listener: (event: IpcRendererEvent, args: any) => void) {
  window.ipc.on('menu-back', listener);
}

/**
 * menu 关闭监听
 */
export function menuListenersRemove() {
  window.ipc.removeAllListeners('menu-back');
}
