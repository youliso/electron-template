import { statSync, writeFileSync, appendFileSync } from 'fs';
import { sep } from 'path';
import { app, ipcMain } from 'electron';
import { EOL } from 'os';

const logFile: string = app.getPath('logs');

/**
 * info日志
 * @param val
 */
export function logInfo(...val: any): void {
  const date = new Date();
  const path =
    logFile +
    `${sep}${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}.info.log`;
  let data = '';
  val.forEach((e: any) => {
    try {
      if (typeof e === 'object') data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  write(
    path,
    `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [info] ${data}${EOL}`
  );
}

/**
 * info错误
 * @param val
 */
export function logError(...val: any): void {
  const date = new Date();
  const path =
    logFile + `${sep}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.error.log`;
  let data = '';
  val.forEach((e: any) => {
    try {
      if (typeof e === 'object') data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  write(
    path,
    `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [error] ${data}${EOL}`
  );
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
