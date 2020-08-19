'use strict';
const {statSync, writeFileSync, mkdirSync, appendFileSync} = require('fs');
const {resolve} = require('path');

class log {
    static getInstance() {
        if (!log.instance) log.instance = new log();
        return log.instance;
    }

    constructor() {
        this.logFile = resolve("./log");
        try {
            statSync(this.logFile);
        } catch (e) {
            mkdirSync(this.logFile, {recursive: true});
        }
    }

    info(val) {
        try {
            statSync(this.logFile + '/info.log');
        } catch (e) {
            writeFileSync(this.logFile + '/info.log', '');
        }
        appendFileSync(this.logFile + '/info.log', `[${new Date()}] ${val}\n`);
    }

    error(val) {
        try {
            statSync(this.logFile + '/error.log');
        } catch (e) {
            writeFileSync(this.logFile + '/error.log', '');
        }
        appendFileSync(this.logFile + '/error.log', `[${new Date()}] ${val}\n`);
    }
}

module.exports = log.getInstance();