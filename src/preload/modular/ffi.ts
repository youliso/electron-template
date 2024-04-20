import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    win32: typeof win32Func;
  }
}

const win32Func = {
  messageBox: (): Promise<number> => {
    return ipcRenderer.invoke('win32-messageBox');
  },
  dwmSetWindowAttribute: (id?: number): Promise<number> => {
    return ipcRenderer.invoke('win32-dwmSetWindowAttribute', id);
  }
};

if (process.platform === 'win32') {
  contextBridge.exposeInMainWorld('win32', win32Func);
}
