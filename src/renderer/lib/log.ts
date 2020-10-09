import {statSync, writeFileSync, mkdirSync, appendFileSync} from "fs";
import {resolve} from "path";
import Tool from './tool';

class Log {
    private static instance: Log;
    private readonly logFile: string = resolve("./logs");

    static getInstance() {
        if (!Log.instance) Log.instance = new Log();
        return Log.instance;
    }

    constructor() {
        try {
            statSync(this.logFile);
        } catch (e) {
            mkdirSync(this.logFile, {recursive: true});
        }
    }

    info(val: string) {
        try {
            statSync(this.logFile + `/info-${Tool.format()}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/info-${Tool.format()}.log`, '');
        }
        appendFileSync(this.logFile + `/info-${Tool.format()}.log`, `[${Tool.format('yyyy-MM-dd hh:mm:ss')}] ${val}\r\n`);
    }

    error(val: string) {
        try {
            statSync(this.logFile + `/error-${Tool.format()}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/error-${Tool.format()}.log`, '');
        }
        appendFileSync(this.logFile + `/error-${Tool.format()}.log`, `[${Tool.format('yyyy-MM-dd hh:mm:ss')}] ${val}\r\n`);
    }
}

export default Log.getInstance();