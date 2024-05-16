import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    resources: typeof func;
  }
}

const func = {
  pathGet: (type: 'platform' | 'inside' | 'extern' | 'root', path?: string): Promise<string> => {
    return ipcRenderer.invoke('resources-path-get', { type, path });
  }
};

contextBridge.exposeInMainWorld('resources', func);
