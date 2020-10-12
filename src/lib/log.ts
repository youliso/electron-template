import {statSync, writeFileSync, mkdirSync, appendFileSync} from "fs";
import {resolve} from "path";

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

    format(is?: boolean) {
        let date = new Date();
        if (is) return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        else return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    info(val: string) {
        try {
            statSync(this.logFile + `/info-${this.format()}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/info-${this.format()}.log`, "");
        }
        appendFileSync(this.logFile + `/info-${this.format()}.log`, `[${this.format(true)}] [info] ${val}\r\n`);
    }

    error(val: string) {
        try {
            statSync(this.logFile + `/error-${this.format()}.log`);
        } catch (e) {
            writeFileSync(this.logFile + `/error-${this.format()}.log`, "");
        }
        appendFileSync(this.logFile + `/error-${this.format()}.log`, `[${this.format(true)}] [error] ${val}\r\n`);
    }
}

export default Log.getInstance();