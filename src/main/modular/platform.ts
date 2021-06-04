import Global from './global';

export function win32() {
}

export function linux() {
}

export function darwin() {}

export const Platform: { [key: string]: Function } = {
  win32,
  linux,
  darwin
};
