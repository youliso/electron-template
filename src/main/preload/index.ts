import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export interface ipcFun {
  send: (channel: string, args?: any) => void;
  sendSync: (channel: string, args?: any) => any;
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  invoke: (channel: string, args?: any) => Promise<any>;
  removeAllListeners: (channel: string) => this;
}

contextBridge.exposeInMainWorld('ipcFun', {
  send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
  sendSync: (channel: string, args?: any) => ipcRenderer.sendSync(channel, args),
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on(channel, listener),
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.once(channel, listener),
  invoke: (channel: string, args: any) => ipcRenderer.invoke(channel, args),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
});
