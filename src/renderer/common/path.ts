export function sep(): string {
  return window.ipc.sendSync('path-sep');
}

export function isAbsolute(path: string): string {
  return window.ipc.sendSync('path-isAbsolute', path);
}

export function dirname(path: string): string {
  return window.ipc.sendSync('path-dirname', path);
}

export function normalize(path: string): string {
  return window.ipc.sendSync('path-normalize', path);
}

export function basename(path: string): string {
  return window.ipc.sendSync('path-basename', path);
}
