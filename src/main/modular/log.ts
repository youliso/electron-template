import { statSync, writeFileSync, appendFileSync } from 'fs';
import { app, ipcMain } from 'electron';
import { dateFormat } from '@/lib';
import { EOL } from 'os';

const logFile: string = app.getPath('logs');

/**
 * info日志
 * @param val
 */
export function logInfo(...val: any): void {
  let data = '', date = dateFormat();
  val.forEach((e: any) => {
    try {
      if (typeof e === 'object') data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  try {
    statSync(logFile + `/info-${date}.log`);
  } catch (e) {
    writeFileSync(logFile + `/info-${date}.log`, '');
  }
  appendFileSync(logFile + `/info-${date}.log`, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [info] ${data}${EOL}`);
}

/**
 * info错误
 * @param val
 */
export function logError(...val: any): void {
  let data = '', date = dateFormat();
  val.forEach((e: any) => {
    try {
      if (typeof e === 'object') data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  try {
    statSync(logFile + `/error-${date}.log`);
  } catch (e) {
    writeFileSync(logFile + `/error-${date}.log`, '');
  }
  appendFileSync(logFile + `/error-${date}.log`, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [error] ${data}${EOL}`);
}

/**
 * 监听
 */
export function logOn() {
  ipcMain.on('log-info', async (event, args) => logInfo(...args));
  ipcMain.on('log-error', async (event, args) => logError(...args));
}