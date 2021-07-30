import type { IpcRendererEvent } from 'electron';

interface Ipc {
  send: (channel: string, args?: any) => void;
  sendSync: (channel: string, args?: any) => any;
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  invoke: (channel: string, args?: any) => Promise<any>;
  removeAllListeners: (channel: string) => this;
}

declare global {
  interface Window {
    ipc: Ipc;
  }
}
