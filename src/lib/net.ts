import fetch, { RequestInit, Headers } from 'node-fetch';
import { AbortController as NodeAbortController } from 'node-abort-controller';
import querystring from 'querystring';
import { isNull } from '@/lib/index';

const { timeout, appUrl } = require('@/cfg/net.json');

export interface NetOpt extends RequestInit {
  authorization?: string;
  isStringify?: boolean; //是否stringify参数（非GET请求使用）
  isHeaders?: boolean; //是否获取headers
  data?: any;
  body?: any;
  type?: NET_RESPONSE_TYPE; //返回数据类型
}

export interface TimeOutAbort {
  signal: AbortSignal;
  id: NodeJS.Timeout;
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
  if (typeof window !== 'undefined') return new AbortController();
  else return new NodeAbortController();
}

/**
 * 超时处理
 * @param outTime
 */
function timeOutAbort(outTime: number): TimeOutAbort {
  const controller = AbortSignal();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, outTime);
  return { signal: controller.signal, id: timeoutId };
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
    .catch((err) => ({ code: 400, msg: err.message }));
}

/**
 * 处理函数
 * @param url
 * @param param
 */
export async function net<T>(url: string, param: NetOpt = {}): Promise<T> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = appUrl + url;
  let abort: TimeOutAbort = null;
  if (isNull(param.signal)) abort = timeOutAbort(param.timeout || timeout);
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
    type: param.type || NET_RESPONSE_TYPE.TEXT,
    method: param.method || 'GET',
    // timeout只会在未指定signal下生效
    signal: abort ? abort.signal : param.signal
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
  return fetchPromise<T>(url, sendData).then((req) => {
    if (abort) clearTimeout(abort.id);
    return req;
  });
}
