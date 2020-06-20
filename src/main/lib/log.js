"use strict";
const fs = require('fs');
const path = require("path");

class log {

    static getInstance() {
        if (!log.instance) log.instance = new log();
        return log.instance;
    }

    constructor() {
        this.file = path.resolve("./log");
        try {
            fs.statSync(this.file);
        } catch (e) {
            fs.mkdirSync(this.file, {recursive: true});
        }
    }

    info(val) {
        try {
            fs.statSync(this.file + '/info.log');
        } catch (e) {
            fs.writeFileSync(this.file + '/info.log', '');
        }
        fs.appendFileSync(this.file + '/info.log', `[${new Date()}] ${val}\n`);
    }

    error(val) {
        try {
            fs.statSync(this.file + '/error.log');
        } catch (e) {
            fs.writeFileSync(this.file + '/error.log', '');
        }
        fs.appendFileSync(this.file + '/error.log', `[${new Date()}] ${val}\n`);
    }
}

module.exports = log.getInstance();