import { statSync, writeFileSync, appendFileSync } from 'fs';
import { sep } from 'path';
import { app, ipcMain } from 'electron';
import { dateFormat } from '@/utils';
import { EOL } from 'os';

const logFile: string = app.getPath('logs');

/**
 * info日志
 * @param val
 */
export function logInfo(...val: any): void {
  const path = logFile + `${sep}info-${dateFormat('yyyy-MM-dd')}.log`;
  let data = '';
  val.forEach((e: any) => {
    try {
      if (typeof e === 'object') data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  write(path, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [info] ${data}${EOL}`);
}

/**
 * info错误
 * @param val
 */
export function logError(...val: any): void {
  const path = logFile + `${sep}error-${dateFormat('yyyy-MM-dd')}.log`;
  let data = '';
  val.forEach((e: any) => {
    try {
      if (typeof e === 'object') data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  write(path, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [error] ${data}${EOL}`);
}

function write(path: string, data: string) {
  try {
    statSync(path);
  } catch (e) {
    writeFileSync(path, data);
    return;
  }
  appendFileSync(path, data);
}

/**
 * 监听
 */
export function logOn() {
  ipcMain.on('log-info', async (event, args) => logInfo(...args));
  ipcMain.on('log-error', async (event, args) => logError(...args));
}
