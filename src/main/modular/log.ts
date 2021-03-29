import { statSync, writeFileSync, appendFileSync } from 'fs';
import { app, ipcMain } from 'electron';
import { dateFormat, isNull } from '@/lib';
import { EOL } from 'os';
import { Window } from '@/main/modular/window';

export class Log {
    private readonly logFile: string = app.getPath('logs');

    constructor() {
    }

    info(...val: any): void {
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
            statSync(this.logFile + `/info-${date}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/info-${date}.log`, '');
        }
        appendFileSync(this.logFile + `/info-${date}.log`, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [info] ${data}${EOL}`);
    }

    error(...val: any): void {
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
            statSync(this.logFile + `/error-${date}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/error-${date}.log`, '');
        }
        appendFileSync(this.logFile + `/error-${date}.log`, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [error] ${data}${EOL}`);
    }

    /**
     * 开启监听
     */
    on() {
        ipcMain.on('log-info', async (event, args) => this.info(...args));
        ipcMain.on('log-error', async (event, args) => this.error(...args));
    }
}