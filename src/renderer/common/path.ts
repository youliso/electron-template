export async function sep(): Promise<string> {
  return await window.ipc.invoke('path-sep');
}

export async function isAbsolute(path: string): Promise<string> {
  return await window.ipc.invoke('path-isAbsolute', path);
}

export async function dirname(path: string): Promise<string> {
  return await window.ipc.invoke('path-dirname', path);
}

export async function normalize(path: string): Promise<string> {
  return await window.ipc.invoke('path-normalize', path);
}

export async function basename(path: string): Promise<string> {
  return await window.ipc.invoke('path-basename', path);
}
