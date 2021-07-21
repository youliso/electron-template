import { Ipc } from './index';

declare global {
  interface Window {
    ipc: Ipc;
  }
}
