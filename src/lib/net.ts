import fetch, {RequestInit, Headers} from "node-fetch";
import AbortController from 'node-abort-controller'
import {getGlobal, sendGlobal} from "@/lib";

const config = require('@/cfg/config.json');

export interface NetOpt extends RequestInit {
    data?: unknown;
    type?: NET_RESPONSE_TYPE; //返回数据类型
}

export enum NET_RESPONSE_TYPE {
    TEXT,
    JSON,
    BUFFER,
    BLOB
}

/**
 * 创建 AbortController
 */
export function AbortSignal() {
    return new AbortController();
}

/**
 * 网络请求
 * @param url string
 * @param param NetSendOpt
 * */

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
 * 错误信息包装
 */
export function errorReturn(msg: string): { [key: string]: unknown } {
    return {code: 400, msg};
}

/**
 * 超时处理
 * @param outTime
 */
function timeoutPromise(outTime: number): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(errorReturn("超时"));
        }, outTime);
    });
}

/**
 * 请求处理
 * @param url
 * @param sendData
 */
function fetchPromise(url: string, sendData: NetOpt): Promise<any> {
    return fetch(url, sendData)
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                const authorization = res.headers.get("authorization");
                if (authorization) sendGlobal("authorization", authorization);
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
            }
        })
}

/**
 * 处理函数
 * @param url
 * @param param
 */
export async function net(url: string, param: NetOpt = {}): Promise<any> {
    if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) url = config.appUrl + url;
    let sendData: NetOpt = {
        headers: new Headers(Object.assign({
                "Content-type": "application/json;charset=utf-8",
                "authorization": getGlobal("authorization") as string || ""
            },
            param.headers || {})),
        timeout: param.timeout || 30000,
        type: param.type || NET_RESPONSE_TYPE.TEXT,
        method: param.method || "GET",
        signal: param.signal || null
    };
    if (sendData.method === "GET") url = url + convertObj(param.data);
    else sendData.body = JSON.stringify(param.data);
    return Promise.race([timeoutPromise(sendData.timeout), fetchPromise(url, sendData)])
        .catch(err => errorReturn(err.message));
}