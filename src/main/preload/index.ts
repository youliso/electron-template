import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export interface ipcFun {
  send: (channel: string, args?: any) => void;
  sendSync: (channel: string, args: any) => any;
  listen: (channel: string, callBack: (event: IpcRendererEvent, args: any) => void) => void;
  listenOnce: (channel: string, callBack: (event: IpcRendererEvent, args: any) => void) => void;
}

contextBridge.exposeInMainWorld('ipcFun', {
  send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
  sendSync: (channel: string, args?: any) => ipcRenderer.sendSync(channel, args),
  listen: (
    channel: string,
    callBack: (event: IpcRendererEvent, args: any) => void
  ) => {
    ipcRenderer.on(channel, ((event, args) => callBack(event, args)));
  },
  listenOnce: (
    channel: string,
    callBack: (event: IpcRendererEvent, args: any) => void
  ) => {
    ipcRenderer.once(channel, ((event, args) => callBack(event, args)));
  }
});