import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    resources: {
      pathGet: (args: any) => Promise<any>;
    };
  }
}

contextBridge.exposeInMainWorld('resources', {
  pathGet: (args: any) => {
    return ipcRenderer.invoke('resources-path-get', args);
  }
});
