import log from 'electron-log';

class Log {
    private static instance: Log;

    static getInstance() {
        if (!Log.instance) Log.instance = new Log();
        return Log.instance;
    }

    constructor() {}

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
