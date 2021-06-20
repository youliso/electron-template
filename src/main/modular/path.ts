import path from 'path';
import { ipcMain } from 'electron';

export function sep() {
  return path.sep;
}

export function normalize(str: string) {
  return path.normalize(str);
}

export function basename(str: string) {
  return path.basename(str);
}

export function pathOn() {
  ipcMain.on('path-sep', async (event, args) => event.returnValue = sep());
  ipcMain.handle('path-normalize', async (event, args) => normalize(args));
  ipcMain.handle('path-basename', async (event, args) => basename(args));
}
