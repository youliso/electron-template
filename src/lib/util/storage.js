'use strict';
const general = require('./general');

class storage {
    static getInstance() {
        if (!storage.instance) storage.instance = new storage();
        return storage.instance;
    }

    constructor() {
    }

    sessionSet(key, value) {
        if (typeof value === "boolean" || typeof value === "string") sessionStorage.setItem(key, value);
        else sessionStorage.setItem(key, JSON.stringify(value));
    }

    sessionGet(key) {
        let data = sessionStorage.getItem(key);
        if (general.isNull(data)) return null;
        return general.toJSON(data);
    }

    sessionRemove(key) {
        sessionStorage.removeItem(key);
    }

    sessionClear() {
        sessionStorage.clear();
    }

    localSet(key, value) {
        if (typeof value === "boolean" || typeof value === "string") localStorage.setItem(key, value);
        else localStorage.setItem(key, JSON.stringify(value));
    }

    localGet(key) {
        let data = localStorage.getItem(key);
        if (_.isNull(data)) return null;
        return _.toJSON(data);
    }

    localRemove(key) {
        localStorage.removeItem(key);
    }

    localClear() {
        localStorage.clear();
    }

    allClear() {
        sessionStorage.clear();
        localStorage.clear();
    }
}


module.exports = storage.getInstance();