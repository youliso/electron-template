import { contextBridge, ipcRenderer } from 'electron';
import { preloadDefaultInit } from '@youliso/electronic/preload';

preloadDefaultInit();

declare global {
  interface Window {
    win32: {
      messageBox: Function;
    };
  }
}

if (process.platform === 'win32') {
  contextBridge.exposeInMainWorld('win32', {
    messageBox: () => {
      return ipcRenderer.send('win32-messageBox');
    }
  });
}
