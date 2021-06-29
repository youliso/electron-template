export function win32() {
}

export function linux() {
}

export function darwin() {}

export const Platforms: { [key: string]: Function } = {
  win32,
  linux,
  darwin
};
