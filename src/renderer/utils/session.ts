import {ipcRenderer} from "electron";

/**
 * 指定url
 */
export function setUrls(args: string[]) {
    ipcRenderer.send("session-set-urls", args);
}

/**
 * 指定headers
 */
export function setHeaders(args: { [key: string]: { [key: string]: string } }) {
    ipcRenderer.send("session-set-headers", args);
}

/**
 * 开启拦截监听
 */
export function webRequest() {
    ipcRenderer.send("session-web-request");
}
