import {ipcRenderer} from "electron";

/**
 * 开启拦截监听指定url请求并更换指定headers
 * @param args 拦截url
 */
export function webRequest(args: {
    urls: string[], value: {
        headers: { [key: string]: string }
    }
}) {
    ipcRenderer.send("session-web-request", args);
}