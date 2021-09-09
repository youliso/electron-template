import type { Accelerator } from '@/main/modular/shortcut';

/**
 * 注册快捷键
 * @param accelerator
 */
export function shortcut(accelerator: Accelerator): void {
  window.ipc.send('shortcut-register', accelerator);
}

/**
 * 批量注册快捷键
 * @param accelerator
 */
export function shortcutAll(accelerator: Accelerator): void {
  window.ipc.send('shortcut-registerAll', accelerator);
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
