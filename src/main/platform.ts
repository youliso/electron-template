export function win32() {
  console.log('win32 platform');
}

export function linux() {
  console.log('linux platform');
}

export function darwin() {
  console.log('darwin platform');
}

export const Platforms: { [key: string]: Function } = {
  win32,
  linux,
  darwin
};
