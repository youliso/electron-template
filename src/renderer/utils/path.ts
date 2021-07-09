export function sep(): string {
  return window.ipcFun.sendSync('path-sep');
}

export function dirname(path: string): string {
  return window.ipcFun.sendSync('path-dirname', path);
}

export function normalize(path: string): string {
  return window.ipcFun.sendSync('path-normalize', path);
}

export function basename(path: string): string {
  return window.ipcFun.sendSync('path-basename', path);
}
