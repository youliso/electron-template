import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    printer: typeof func;
  }
}

const func = {
  quit: () => {
    return ipcRenderer.send('printer-quit');
  },
  list: () => {
    return ipcRenderer.invoke('printer-list');
  },
  do: (args: any) => {
    return ipcRenderer.send('printer-do', args);
  },
  dos: (args: any) => {
    return ipcRenderer.send('printer-dos', args);
  }
};

contextBridge.exposeInMainWorld('printer', func);
