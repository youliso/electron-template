/**
 * 浏览器存储(渲染进程)
 * */

class BrowserStorage {
    private static instance: BrowserStorage;

    static getInstance() {
        if (!BrowserStorage.instance) BrowserStorage.instance = new BrowserStorage();
        return BrowserStorage.instance;
    }

    constructor() {
    }

    sessionSet(key: string, value: string) {
        if (typeof value === "boolean" || typeof value === "string") sessionStorage.setItem(key, value);
        else sessionStorage.setItem(key, JSON.stringify(value));
    }

    sessionGet(key: string): unknown {
        let data = sessionStorage.getItem(key);
        if (data === "" || data === null || data === undefined) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }

    sessionRemove(key: string) {
        sessionStorage.removeItem(key);
    }

    sessionClear() {
        sessionStorage.clear();
    }

    localSet(key: string, value: string) {
        if (typeof value === "boolean" || typeof value === "string") localStorage.setItem(key, value);
        else localStorage.setItem(key, JSON.stringify(value));
    }

    localGet(key: string): unknown {
        let data = localStorage.getItem(key);
        if (data === "" || data === null || data === undefined) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }

    localRemove(key: string) {
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

export default BrowserStorage.getInstance();