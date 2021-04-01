import { ipcFun } from './index';

declare global {
  interface Window {
    ipcFun: ipcFun,
  }
}
