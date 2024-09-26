import preload from '@youliso/electronic/preload';
import { contextBridge, ipcRenderer } from 'electron';

preload.preload(contextBridge, ipcRenderer);
