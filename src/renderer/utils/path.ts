export async function sep(): Promise<string> {
  return await window.ipcFun.invoke('path-sep');
}

export async function normalize(path: string): Promise<string> {
  return await window.ipcFun.invoke('path-normalize', path);
}

export async function basename(path: string) {
  return await window.ipcFun.invoke('path-basename', path);
}
