import {session} from "electron";

/**
 * 拦截监听指定url请求
 */
export let urls: string[] = [
    "http://127.0.0.1/*"
]

export function sessionInit() {
    session.defaultSession.webRequest.onBeforeSendHeaders({
        urls
    }, (details, callback) => {
        callback({requestHeaders: details.requestHeaders});
    })
}