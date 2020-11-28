import {remote} from "electron";
import {sendGlobal, getGlobal} from "./ipc";

const config = require('../../lib/cfg/config.json');

export interface NetSendOpt extends RequestInit {
    data?: unknown;
    outTime?: number; //请求超时时间
    type?: NET_RESPONSE_TYPE; //返回数据类型
}

export enum NET_RESPONSE_TYPE {
    TEXT,
    JSON,
    BUFFER,
    BLOB,
    FORM_DATA
}

/**
 * 去除空格
 * */
export function trim(str: string): string {
    return str.replace(/^\s*|\s*$/g, "");
}

/**
 * 判空
 * */
export function isNull(arg: unknown): boolean {
    if (typeof arg === 'string') arg = trim(arg);
    return !arg && arg !== 0 && typeof arg !== "boolean" ? true : false;
}

/**
 * 随机整数
 * 例如 6-10 （m-n）
 * */
export function ranDom(m: number, n: number): number {
    return Math.floor(Math.random() * (n - m)) + m;
}

/**
 * 数组元素互换
 * */
export function swapArr<T>(arr: T[], index1: number, index2: number): void {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

/**
 * 日期转换
 * @param fmt yy-MM-dd Hh:mm:ss
 * */
export function format(fmt: string = 'yyyy-MM-dd'): string {
    let date = new Date();
    let o: { [key: string]: unknown } = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) as string : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 对象转url参数
 * */
export function convertObj(data: any): string {
    let _result = [];
    for (let key in data) {
        let value = data[key] as Array<any>;
        if (value && value.constructor == Array) {
            value.forEach((_value) => {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + "=" + value);
        }
    }
    return _result.join("&");
}

/**
 * url参数转对象
 */
export function GetQueryJson2(url: string): { [key: string]: unknown } {
    let arr = []; // 存储参数的数组
    let res: { [key: string]: unknown } = {}; // 存储最终JSON结果对象
    arr = url.split("&"); // 获取浏览器地址栏中的参数
    for (let i = 0; i < arr.length; i++) { // 遍历参数
        if (arr[i].indexOf("=") != -1) { // 如果参数中有值
            let str = arr[i].split("=");
            res[str[0]] = str[1];
        } else { // 如果参数中无值
            res[arr[i]] = "";
        }
    }
    return res;
}

/**
 * 网络请求
 * @param url string
 * @param param NetSendOpt
 * */
export async function net(url: string, param: NetSendOpt = {}): Promise<any> {
    if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) url = config.appUrl + url;
    let sendData: NetSendOpt = {
        headers: {
            "user-agent": `${remote.app.name}/${remote.app.getVersion()}`,
            "Content-type": "application/json;charset=utf-8",
            "Authorization": getGlobal("Authorization") as string || ""
        },
        outTime: param.outTime || 30000,
        type: param.type || NET_RESPONSE_TYPE.TEXT,
        mode: "cors"
    };
    param = param || {};
    if (param.headers) sendData.headers = param.headers;
    if (param.outTime) sendData.outTime = param.outTime;
    if (param.mode) sendData.mode = param.mode;
    sendData.method = param.method || "GET";
    if (sendData.method === "GET") url = url + convertObj(param.data);
    else sendData.body = JSON.stringify(param.data);
    let timeoutPromise = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject({code: -1, msg: "超时"});
            }, sendData.outTime);
        });
    };
    let fetchPromise = () => {
        return fetch(url, sendData)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    let Authorization = res.headers.get("Authorization");
                    if (Authorization) sendGlobal("Authorization", Authorization);
                    return res;
                }
                throw new Error(res.statusText);
            })
            .then(async (res) => {
                switch (sendData.type) {
                    case NET_RESPONSE_TYPE.TEXT:
                        return await res.text();
                    case NET_RESPONSE_TYPE.JSON:
                        return await res.json();
                    case NET_RESPONSE_TYPE.BUFFER:
                        return await res.arrayBuffer();
                    case NET_RESPONSE_TYPE.BLOB:
                        return await res.blob();
                    case NET_RESPONSE_TYPE.FORM_DATA:
                        return await res.formData()
                }
            })
    };
    return Promise.race([timeoutPromise(), fetchPromise()])
}

/**
 * 深拷贝
 * @param obj
 */
export function deepCopy<T>(obj: T): T {
    let objArray: any = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object") {
                    objArray[key] = deepCopy(obj[key]);
                } else {
                    objArray[key] = obj[key];
                }
            }
        }
    }
    return objArray;
}
