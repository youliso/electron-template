import { queryParams } from "@/utils";

export interface RequestOpt extends RequestInit {
  isStringify?: boolean; //是否stringify参数（非GET请求使用）
  isHeaders?: boolean; //是否获取headers
  data?: any;
  timeout?: number;
  type?: "TEXT" | "JSON" | "BUFFER" | "BLOB"; //返回数据类型
}

export interface TimeOutAbort {
  signal: AbortSignal;
  id: number;
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
  return { signal: controller.signal, id: timeoutId as unknown as any };
}

/**
 * 请求处理
 * @param url
 * @param sendData
 */
function fetchPromise<T>(url: string, sendData: RequestOpt): Promise<T> {
  return fetch(url, sendData)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) return res;
      throw new Error(res.statusText);
    })
    .then(async (res) => {
      switch (sendData.type) {
        case "TEXT":
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.text(),
              }
            : await res.text();
        case "JSON":
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.json(),
              }
            : await res.json();
        case "BUFFER":
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.arrayBuffer(),
              }
            : await res.arrayBuffer();
        case "BLOB":
          return sendData.isHeaders
            ? {
                headers: await res.headers,
                data: await res.blob(),
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
export async function net<T>(url: string, param: RequestOpt = {}): Promise<T> {
  let abort: TimeOutAbort | null = null;
  if (!param.signal) abort = timeOutAbort(param.timeout || 3000);
  let sendData: RequestOpt = {
    isHeaders: param.isHeaders,
    isStringify: param.isStringify,
    headers: new Headers(
      Object.assign(
        {
          "content-type": "application/json;charset=utf-8",
        },
        param.headers
      )
    ),
    type: param.type || "TEXT",
    method: param.method || "GET",
    // timeout只会在未指定signal下生效
    signal: abort ? abort.signal : param.signal,
  };
  if (param.data) {
    if (sendData.method === "GET") url = `${url}?${queryParams(param.data)}`;
    else
      sendData.body = sendData.isStringify
        ? queryParams(param.data)
        : JSON.stringify(param.data);
  }
  return fetchPromise<T>(url, sendData).then((req) => {
    if (abort) clearTimeout(abort.id);
    return req;
  });
}
