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
 * 获取依赖文件路径
 * */
export async function getResourcesPath(
  type: 'platform' | 'inside' | 'extern' | 'root',
  path?: string
): Promise<string> {
  return await window.ipc.invoke('global-resources-path-get', { type, path });
}

/**
 * app重启
 * @param once 是否立即重启
 */
export function relaunch(once: boolean): void {
  return window.ipc.send('app-relaunch', once);
}

/**
 * app常用信息
 * @returns
 */
export async function getAppInfo(): Promise<AppInfo> {
  return await window.ipc.invoke('app-info-get');
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
