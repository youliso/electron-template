import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    printer: {
      quit: () => Promise<any>;
      list: () => Promise<any>;
      do: (args: any) => Promise<any>;
    };
  }
}

contextBridge.exposeInMainWorld('printer', {
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
});
