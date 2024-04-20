import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    resources: typeof func;
  }
}

const func = {
  pathGet: (args: any) => {
    return ipcRenderer.invoke('resources-path-get', args);
  }
};

contextBridge.exposeInMainWorld('resources', func);
