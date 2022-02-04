import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import { EOL } from 'os';
import { isSecondInstanceWin } from '@/cfg/app.json';

contextBridge.exposeInMainWorld('ipc', {
  send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
  sendSync: (channel: string, args?: any) => ipcRenderer.sendSync(channel, args),
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on(channel, listener),
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.once(channel, listener),
  invoke: (channel: string, args: any) => ipcRenderer.invoke(channel, args),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
});

contextBridge.exposeInMainWorld('environment', {
  EOL,
  systemVersion: process.getSystemVersion(),
  platform: process.platform,
  isSecondInstanceWin
});
