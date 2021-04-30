import { systemPreferences } from 'electron';
import { Global } from './global';

/**
 * 针对各种运行平台进行加载特定内容
 * @param global 默认传入全局变量
 */

export function win32(global: Global) {
  global.sharedObject['appInfo']['accentColor'] = systemPreferences.getAccentColor();
}

export function linux(global: Global) {
}

export function darwin(global: Global) {
}

export const Platform: { [key: string]: Function } = {
  win32,
  linux,
  darwin
};
