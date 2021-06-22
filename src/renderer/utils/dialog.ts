import { OpenDialogOptions } from 'electron';

/**
 * 打开dialog
 * @param winId
 * @param params
 */
export async function openDialog(winId: number, params: OpenDialogOptions) {
  return window.ipcFun.invoke('open-dialog', { winId, params });
}
