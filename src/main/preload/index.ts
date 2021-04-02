import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export interface ipcFun {
  send: (channel: string, args?: any) => void;
  sendSync: (channel: string, args: any) => any;
  on: (channel: string, callBack: (event: IpcRendererEvent, args: any) => void) => void;
  once: (channel: string, callBack: (event: IpcRendererEvent, args: any) => void) => void;
  invoke: (channel: string, args: any) => Promise<any>;
}

contextBridge.exposeInMainWorld('ipcFun', {
  send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
  sendSync: (channel: string, args?: any) => ipcRenderer.sendSync(channel, args),
  on: (
    channel: string,
    callBack: (event: IpcRendererEvent, args: any) => void
  ) => {
    ipcRenderer.on(channel, ((event, args) => callBack(event, args)));
  },
  once: (
    channel: string,
    callBack: (event: IpcRendererEvent, args: any) => void
  ) => {
    ipcRenderer.once(channel, ((event, args) => callBack(event, args)));
  },
  invoke: (
    channel: string,
    args: any
  ) => {
    return ipcRenderer.invoke(channel, args);
  }
});