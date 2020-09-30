import {statSync, mkdirSync} from "fs";
import {resolve} from 'path';
import log from 'electron-log';

class Log {
    private static instance: Log;

    static getInstance() {
        if (!Log.instance) Log.instance = new Log();
        return Log.instance;
    }

    constructor() {
        try {
            statSync(resolve("./logs"));
        } catch (e) {
            mkdirSync(resolve("./logs"), {recursive: true});
        }
        log.transports.file.file = resolve("./logs/log");
    }

    info(val: string) {
        log.info(val);
    }

    warn(val: string) {
        log.warn(val);
    }

    error(val: string) {
        log.error(val);
    }
}

export default Log.getInstance();
