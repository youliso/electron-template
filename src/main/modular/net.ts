import { openAsBlob } from 'node:fs';
import { basename } from 'node:path';
import { WritableStream } from 'node:stream/web';

type DATA_TYPE = 'TEXT' | 'JSON' | 'BUFFER';

/**
 * 数据处理
 */
export const responseData = async (type: DATA_TYPE, response: Response) => {
  let data;
  switch (type) {
    case 'JSON':
      data = await response.json().catch((error) => {
        throw error;
      });
      break;
    case 'TEXT':
      data = await response.text().catch((error) => {
        throw error;
      });
      break;
    case 'BUFFER':
    default:
      data = await response.arrayBuffer().catch((error) => {
        throw error;
      });
      data = Buffer.from(data);
      break;
  }
  return { data, headers: response.headers };
}

/**
 * 对象转参数
 * @param data
 */
export const queryParams = (data: any): string => {
  let _result = [];
  for (let key in data) {
    let value = data[key];
    if (['', undefined, null].includes(value)) {
      continue;
    }
    if (value.constructor === Array) {
      value.forEach((_value) => {
        // @ts-ignore
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
      });
    } else {
      // @ts-ignore
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  return _result.length ? _result.join('&') : '';
};

export interface RequestOpt extends RequestInit {
  controller?: AbortController;
  data?: any;
  timeout?: number;
  type?: DATA_TYPE;
}

export interface RequestDownloadOpt extends RequestOpt {
  onChunk: (chunk: Buffer, allLength: number) => void;
}

export interface RequestUploadOpt extends RequestOpt {
  filePath: string;
  fileKey?: string;
  fileName?: string;
  onUploadProgress?: (progress: number) => void;
}

/**
 * 请求
 */
export const request = <T>(
  url: string,
  params: RequestOpt = {}
): Promise<{
  headers?: Headers;
  data?: T;
  error?: Error;
}> => {
  params.method ??= 'GET';
  params.timeout ??= 1000 * 60;
  params.type ??= 'JSON';
  params.headers ??= { 'content-type': 'application/json;charset=utf-8' };
  if (params.data && params.method === 'GET') url += `?${queryParams(params.data)}`;
  const controller = params.controller ?? new AbortController();
  const id = setTimeout(() => controller.abort(), params.timeout);
  return fetch(url, { ...params, signal: controller.signal })
    .then(async (response) => {
      clearTimeout(id);
      return await responseData(params.type!, response);
    })
    .catch((error) => {
      clearTimeout(id);
      return { error };
    });
};

/**
 * 下载
 */
export const download = async (
  url: string,
  params: RequestDownloadOpt
): Promise<{
  headers?: Headers;
  data?: string;
  error?: Error;
}> => {
  params.method ??= 'GET';
  params.timeout ??= 1000 * 60;
  if (params.data && params.method === 'GET') url += `?${queryParams(params.data)}`;
  const controller = params.controller ?? new AbortController();
  const id = setTimeout(() => controller.abort(), params.timeout);
  try {
    const response = await fetch(url, { ...params, signal: controller.signal }).catch((error) => {
      throw error;
    });
    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    clearTimeout(id);
    const totalLength = parseInt(response.headers.get('content-length') || '0', 10);
    const reader = response.body.getReader();
    const read = async () => {
      while (true) {
        const { done, value } = await reader.read().catch((error) => {
          throw error;
        });
        if (done) break;
        params.onChunk(Buffer.from(value), totalLength);
      }
    };
    await read().catch((error) => {
      throw error;
    });
    return { data: 'end', headers: response.headers };
  } catch (error) {
    clearTimeout(id);
    return { error: error as Error };
  }
};

/**
 * 上传
 */
export const upload = async (
  url: string,
  params: RequestUploadOpt
): Promise<{
  headers?: Headers;
  data?: string;
  error?: Error;
}> => {
  params.method ??= 'POST';
  params.type ??= 'JSON';
  params.timeout ??= 1000 * 60;
  if (params.data && params.method === 'GET') url += `?${queryParams(params.data)}`;
  const controller = params.controller ?? new AbortController();
  const id = setTimeout(() => controller.abort(), params.timeout);
  try {
    let sendChunkLength = 0;
    const isProgress = !!params.onUploadProgress;
    const form = new FormData();
    const blob = await openAsBlob(params.filePath);
    blob.stream().pipeTo(
      new WritableStream({
        write(chunk) {
          sendChunkLength += chunk.length;
          isProgress && params.onUploadProgress!(sendChunkLength / blob.size);
        }
      })
    );
    form.append(
      params.fileKey || 'file',
      blob,
      params.fileName ?? basename(params.filePath)
    );
    const response = await fetch(url, {
      ...params,
      body: form,
      signal: controller.signal
    }).catch((error) => {
      throw error;
    });
    clearTimeout(id);
    return await responseData(params.type!, response);
  } catch (error) {
    clearTimeout(id);
    return { error: error as Error };
  }
};

export default request;
