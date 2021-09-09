import type { Accelerator } from '@/main/modular/shortcut';
import type { IpcRendererEvent } from 'electron';

/**
 * 快捷键监听
 * @param key
 * @param listener
 */
export function shortcutOn(key: string, listener: (event: IpcRendererEvent, args: any) => void) {
  window.ipc.on(`shortcut-${key}-back`, listener);
}

/**
 * 注册快捷键
 * @param name
 * @param key
 */
export function shortcut(name: string, key: string): void {
  window.ipc.send('shortcut-register', { name, key });
}

/**
 * 批量注册快捷键
 * @param name
 * @param keys
 */
export function shortcutAll(name: string, keys: string[]): void {
  window.ipc.send('shortcut-registerAll', { name, keys });
}

/**
 * 清除快捷键
 * @param key
 */
export function unShortcut(key: string) {
  window.ipc.send('shortcut-unregister', key);
}

/**
 * 清空全部快捷键
 */
export function unShortcutAll() {
  window.ipc.send('shortcut-unregisterAll');
}

/**
 * 获取已注册快捷键
 * @param key
 */
export function shortcutGet(key: string): Accelerator {
  return window.ipc.sendSync('shortcut-get', key);
}

/**
 * 获取全部已注册快捷键
 */
export function shortcutGetAll(): Accelerator[] {
  return window.ipc.sendSync('shortcut-getAll');
}
