import {statSync, writeFileSync, mkdirSync, appendFileSync} from "fs";
import {resolve} from "path";

class Log {
    private static instance: Log;
    private readonly logFile: string = resolve("./log");

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
            statSync(this.logFile + '/info.log');
        } catch (e) {
            writeFileSync(this.logFile + '/info.log', '');
        }
        appendFileSync(this.logFile + '/info.log', `[${new Date()}] ${val}\r\n`);
    }

    error(val: string) {
        try {
            statSync(this.logFile + '/error.log');
        } catch (e) {
            writeFileSync(this.logFile + '/error.log', '');
        }
        appendFileSync(this.logFile + '/error.log', `[${new Date()}] ${val}\r\n`);
    }
}

export default Log.getInstance();
