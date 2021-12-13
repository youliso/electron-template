import { queryParams } from '@/utils';

const { timeout, appUrl } = require('@/cfg/net.json');

export interface NetOpt extends RequestInit {
  isStringify?: boolean; //是否stringify参数（非GET请求使用）
  isHeaders?: boolean; //是否获取headers
  data?: any;
  body?: any;
  timeout?: number;
  type?: 'TEXT' | 'JSON' | 'BUFFER' | 'BLOB'; //返回数据类型
}

export interface TimeOutAbort {
  signal: AbortSignal;
  id: NodeJS.Timeout;
}

/**
 * 创建 AbortController
 */
export function AbortSignal() {
  return new AbortController();
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
        case 'TEXT':
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.text()
              }
            : await res.text();
        case 'JSON':
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.json()
              }
            : await res.json();
        case 'BUFFER':
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.arrayBuffer()
              }
            : await res.arrayBuffer();
        case 'BLOB':
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.blob()
              }
            : await res.blob();
      }
    });
}

/**
 * http请求
 * @param url
 * @param param
 */
export default async function net<T>(url: string, param: NetOpt = {}): Promise<T> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = appUrl + url;
  let abort: TimeOutAbort | null = null;
  if (!param.signal) abort = timeOutAbort(param.timeout || timeout);
  let sendData: NetOpt = {
    isHeaders: param.isHeaders,
    isStringify: param.isStringify,
    headers: new Headers(
      Object.assign(
        {
          'content-type': 'application/json;charset=utf-8'
        },
        param.headers
      )
    ),
    type: param.type || 'TEXT',
    method: param.method || 'GET',
    // timeout只会在未指定signal下生效
    signal: abort ? abort.signal : param.signal
  };
  if (param.body) {
    sendData.body = param.body;
  } else if (param.data) {
    if (sendData.method === 'GET') url = `${url}?${queryParams(param.data)}`;
    else
      sendData.body = sendData.isStringify ? queryParams(param.data) : JSON.stringify(param.data);
  }
  return fetchPromise<T>(url, sendData).then((req) => {
    if (abort) clearTimeout(abort.id);
    return req;
  });
}
