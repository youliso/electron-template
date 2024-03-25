import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    serial: {
      list: () => Promise<any>;
      close: (key: string) => Promise<any>;
      open: (args: any) => Promise<any>;
      send: (args: any) => Promise<any>;
    };
  }
}

contextBridge.exposeInMainWorld('serial', {
  list: () => {
    return ipcRenderer.invoke('serial-list');
  },
  close: (key: string) => {
    return ipcRenderer.invoke('serial-close', key);
  },
  open: (args: any) => {
    return ipcRenderer.invoke('serial-open', args);
  },
  send: (args: any) => {
    return ipcRenderer.invoke('serial-send', args);
  }
});
