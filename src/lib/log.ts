import {statSync, writeFileSync, mkdirSync, appendFileSync} from "fs";
import {resolve} from "path";
import {dateFormat} from "./";
import {EOL} from "os";

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

    info(...val: any): void {
        let data = "", date = dateFormat();
        val.forEach((e: any) => data += e.toString());
        try {
            statSync(this.logFile + `/info-${date}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/info-${date}.log`, "");
        }
        appendFileSync(this.logFile + `/info-${date}.log`, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [info] ${data}${EOL}`);
    }

    error(...val: any): void {
        let data = "", date = dateFormat();
        val.forEach((e: any) => data += e.toString());
        try {
            statSync(this.logFile + `/error-${date}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/error-${date}.log`, "");
        }
        appendFileSync(this.logFile + `/error-${date}.log`, `[${dateFormat('yy-MM-dd hh:mm:ss')}] [error] ${data}${EOL}`);
    }
}

export default Log.getInstance();