'use strict';

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
        if (data === "" || data === null || data === undefined) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
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
        if (data === "" || data === null || data === undefined) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
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