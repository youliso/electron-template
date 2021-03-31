import { ipcRenderer } from 'electron';
import { IpcMsg } from '@/lib/interface';
import { setMessageData } from '@/renderer/store';

/**
 * 渲染进程初始化 (i)
 * */
export async function windowLoad() {
  return new Promise(resolve => ipcRenderer.once('window-load', async (event, args) => resolve(args)));
}

/**
 * 消息反馈 (i)
 */
export function messageBack() {
  ipcRenderer.on('message-back', (event, args) => setMessageData(args.key, args.value));
}

/**
 * 消息发送
 */
export function messageSend(args: IpcMsg) {
  ipcRenderer.send('message-send', args);
}

/**
 * app常用获取路径
 */
export function getAppPath(key: string) {
  return ipcRenderer.sendSync('app-path-get', { key });
}

/**
 * 发送ipc消息
 * @param key
 * @param value
 */
export function ipcSend(key: string, value?: unknown) {
  ipcRenderer.send(key, value);
}

/**
 * 日志(info)
 * @param args
 */
export function logInfo(...args: any) {
  ipcRenderer.send('log-info', args);
}

/**
 * 日志(error)
 * @param args
 */
export function logError(...args: any) {
  ipcRenderer.send('log-error', args);
}

/**
 * 设置全局参数
 * @param key 键
 * @param value 值
 */
export function sendGlobal(key: string, value: unknown) {
  return ipcRenderer.sendSync('global-sharedObject-set', {
    key,
    value
  });
}

/**
 * 获取全局参数
 * @param key 键
 */
export function getGlobal(key: string) {
  return ipcRenderer.sendSync('global-sharedObject-get', key);
}

/**
 * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
 * @param path lib/inside为起点的相对路径
 * */
export function getInsidePath(path: string): string {
  return ipcRenderer.sendSync('global-insidePath-get', path);
}

/**
 * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
 * @param path lib/extern为起点的相对路径
 * */
export function getExternPath(path: string): string {
  return ipcRenderer.sendSync('global-externPath-get', path);
}