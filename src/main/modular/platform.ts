import { systemPreferences } from 'electron';
import { Global } from './global';

export function win32(global: Global) {
  global.sharedObject['appInfo']['accentColor'] = systemPreferences.getAccentColor();
}

export function linux(global: Global) {
  global.sharedObject['appInfo']['accentColor'] = '000000';
}

export function darwin() {

}

export const Platform: { [key: string]: Function } = {
  win32,
  linux,
  darwin
};
