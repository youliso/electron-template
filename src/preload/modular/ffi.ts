import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    win32: {
      messageBox: () => Promise<number>;
      dwmSetWindowAttribute: (id?: number) => Promise<number>;
    };
  }
}

if (process.platform === 'win32') {
  contextBridge.exposeInMainWorld('win32', {
    messageBox: () => {
      return ipcRenderer.invoke('win32-messageBox');
    },
    dwmSetWindowAttribute: () => {
      return ipcRenderer.invoke('win32-dwmSetWindowAttribute');
    }
  });
}
