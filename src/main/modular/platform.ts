import { systemPreferences } from 'electron';
import Global from './global';

export function win32() {
  Global.sharedObject['app']['dom']['css']['--platform-theme-color'] =
    '#' + systemPreferences.getAccentColor();
}

export function linux() {
  Global.sharedObject['app']['dom']['css']['--platform-theme-color'] = '#000000';
}

export function darwin() {}

export const Platform: { [key: string]: Function } = {
  win32,
  linux,
  darwin
};
