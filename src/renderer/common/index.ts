/**
 * 发送ipc消息
 * @param key
 * @param value
 */
export function ipcSend(key: string, value?: unknown) {
  window.ipc.send(key, value);
}

/**
 * 日志(info)
 * @param args
 */
export function logInfo(...args: any): void {
  window.ipc.send('log-info', args);
}

/**
 * 日志(error)
 * @param args
 */
export function logError(...args: any): void {
  window.ipc.send('log-error', args);
}

/**
 * 设置全局参数
 * @param key 键
 * @param value 值
 */
export async function sendGlobal(key: string, value: unknown): Promise<void> {
  return await window.ipc.invoke('global-sharedObject-set', {
    key,
    value
  });
}

/**
 * 获取全局参数
 * @param key 键
 */
export async function getGlobal<T>(key: string): Promise<T> {
  return await window.ipc.invoke('global-sharedObject-get', key);
}

/**
 * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
 * @param path lib/inside为起点的相对路径
 * */
export async function getInsidePath(path: string): Promise<string> {
  return await window.ipc.invoke('global-insidePath-get', path);
}

/**
 * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
 * @param path lib/extern为起点的相对路径
 * */
export async function getExternPath(path: string): Promise<string> {
  return await window.ipc.invoke('global-externPath-get', path);
}

/**
 * app重启
 * @param once 是否立即重启
 */
export function relaunch(once: boolean): void {
  return window.ipc.send('app-relaunch', once);
}

/**
 * app常用获取路径
 */
export async function getAppPath(key: string): Promise<string> {
  return await window.ipc.invoke('app-path-get', { key });
}

/**
 * app打开url
 */
export async function openUrl(url: string): Promise<void> {
  return await window.ipc.invoke('app-open-url', { url });
}
