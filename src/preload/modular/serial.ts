import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    serial: typeof func;
  }
}

const func = {
  list: (): Promise<import('@serialport/bindings-interface').PortInfo[]> => {
    return ipcRenderer.invoke('serial-list');
  },
  close: (key: string): Promise<any> => {
    return ipcRenderer.invoke('serial-close', key);
  },
  open: (args: any): Promise<any> => {
    return ipcRenderer.invoke('serial-open', args);
  },
  send: (args: any): Promise<any> => {
    return ipcRenderer.invoke('serial-send', args);
  }
};

contextBridge.exposeInMainWorld('serial', func);
