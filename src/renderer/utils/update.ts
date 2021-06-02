import { IpcRendererEvent } from 'electron';
/**
 * 检查更新 (注: 只需调用一次,多次调用会造成更新模块多次监听)
 */
export function updateCheck() {
  window.ipcFun.send('update-check');
}

/**
 * 更新监听
 */
export function updateOn(listener: (event: IpcRendererEvent, args: any) => void) {
  window.ipcFun.on('update-back', listener);
}

/**
 * socket 关闭监听
 */
export function updateListenersRemove() {
  window.ipcFun.removeAllListeners('update-back');
}

/**
 * 重新检查更新
 * @param isDel 是否删除历史更新缓存
 */
export function updateReCheck(isDel: boolean) {
  window.ipcFun.send('update-recheck', isDel);
}

/**
 * 关闭程序进行更新
 * @param isSilent 是否静默更新
 */
export function updateQuitInstall(isSilent: boolean) {
  window.ipcFun.send('update-quit-install', isSilent);
}
