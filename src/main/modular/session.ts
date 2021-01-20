import {Filter, ipcMain, session} from "electron";

/**
 * 监听
 */
export class Session {

    /**
     * urls列表
     */
    public urls: string[] = [];

    /**
     * 头部 headers
     */
    public urlHeaders: { [key: string]: { [key: string]: string } } = {}

    constructor() {
    }

    /**
     * 拦截监听指定url请求并更换指定headers
     */
    webRequest() {
        session.defaultSession.webRequest.onBeforeSendHeaders({
            urls: this.urls
        }, (details, callback) => {
            const keys = Object.keys(this.urlHeaders).filter((key: string) => {
                return details.url.indexOf(key) === 0;
            })
            for (let key of keys) {
                for (let v in this.urlHeaders[key]) {
                    details.requestHeaders[v] = this.urlHeaders[key][v];
                }
            }
            callback({requestHeaders: details.requestHeaders});
        });
    }

    /**
     * 设置setUserAgent/acceptLanguages
     * @param userAgent
     * @param acceptLanguages
     */
    setUserAgent(userAgent: string, acceptLanguages?: string) {
        session.defaultSession.setUserAgent(userAgent, acceptLanguages);
    }

    /**
     * 开启监听
     */
    on() {
        //设置urls
        ipcMain.on("session-set-urls", async (event, args) => {
            this.urls = args;
        });
        //设置headers
        ipcMain.on("session-set-headers", async (event, args) => {
            this.urlHeaders = args;
        });
        //启动webRequest (只需调用一次)
        ipcMain.on("session-web-request", async () => {
            this.webRequest();
        });
    }

}
