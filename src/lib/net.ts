import fetch, { RequestInit, Headers } from 'node-fetch';
import AbortController from 'node-abort-controller';
import querystring from 'querystring';
import { isNull } from '@/lib/index';

const { appUrl } = require('@/cfg/net.json');

export interface NetOpt extends RequestInit {
  authorization?: string;
  isStringify?: boolean; //是否stringify参数（非GET请求使用）
  isHeaders?: boolean; //是否获取headers
  data?: any;
  body?: any;
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
 * 错误信息包装
 */
export function errorReturn(msg: Error): { code: number; msg: string } {
  return { code: 400, msg: msg.message };
}

/**
 * 超时处理
 * @param outTime
 */
function timeoutPromise(outTime: number): Promise<{ code: number; msg: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(errorReturn(new Error('超时')));
    }, outTime);
  });
}

/**
 * 请求处理
 * @param url
 * @param sendData
 */
function fetchPromise<T>(url: string, sendData: NetOpt): Promise<T> {
  return fetch(url, sendData)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) return res;
      throw new Error(res.statusText);
    })
    .then(async (res) => {
      switch (sendData.type) {
        case NET_RESPONSE_TYPE.TEXT:
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.text()
              }
            : await res.text();
        case NET_RESPONSE_TYPE.JSON:
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.json()
              }
            : await res.json();
        case NET_RESPONSE_TYPE.BUFFER:
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.arrayBuffer()
              }
            : await res.arrayBuffer();
        case NET_RESPONSE_TYPE.BLOB:
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.blob()
              }
            : await res.blob();
      }
    })
    .catch((err) => {
      throw new Error(err.statusText);
    });
}

/**
 * 处理函数
 * @param url
 * @param param
 */
export async function net<T>(
  url: string,
  param: NetOpt = {}
): Promise<T & { code: number; msg: string }> {
  if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) url = appUrl + url;
  let sendData: NetOpt = {
    isHeaders: param.isHeaders,
    isStringify: param.isStringify,
    headers: new Headers(
      Object.assign(
        {
          'content-type': 'application/json;charset=utf-8',
          authorization: param.authorization || ''
        },
        param.headers
      )
    ),
    timeout: param.timeout || 30000,
    type: param.type || NET_RESPONSE_TYPE.TEXT,
    method: param.method || 'GET',
    signal: param.signal || null
  };
  if (!isNull(param.body)) {
    sendData.body = param.body;
  } else if (!isNull(param.data)) {
    if (sendData.method === 'GET') url = `${url}?${querystring.stringify(param.data)}`;
    else
      sendData.body = sendData.isStringify
        ? querystring.stringify(param.data)
        : JSON.stringify(param.data);
  }
  return Promise.race([timeoutPromise(sendData.timeout), fetchPromise<T>(url, sendData)]).catch(
    errorReturn
  ) as Promise<T & { code: number; msg: string }>;
}
