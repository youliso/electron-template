import {Filter, session} from "electron";

/**
 * 监听
 */
export class Session {

    /**
     * urls列表
     */
    private filer: Filter = {
        urls: []
    };

    constructor() {
    }

    /**
     * 拦截监听指定url请求并更换指定headers
     * @param args
     */
    webRequest(args: {
        urls: string[], value: {
            headers: { [key: string]: string }
        }
    }) {
        this.filer.urls = args.urls;
        session.defaultSession.webRequest.onBeforeSendHeaders({
            urls: args.urls
        }, (details, callback) => {
            for (let i of Object.keys(args.value.headers)) {
                details.requestHeaders[i] = args.value.headers[i];
            }
            callback({requestHeaders: details.requestHeaders});
        });
    }

}