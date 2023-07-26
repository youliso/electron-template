import type { ClientRequestArgs, IncomingMessage, OutgoingHttpHeaders } from 'http';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { basename, extname } from 'path';
import { createReadStream, statSync } from 'fs';

export type Response = IncomingMessage;
export type HeadersInit = OutgoingHttpHeaders;

export interface RequestOpt extends RequestInit {
  // 是否stringify参数（非GET请求使用）
  isStringify?: boolean;
}

export interface RequestUploadOpt extends RequestInit {
  filePath: string;
  onUploadProgress?: (status: 'open' | 'ing' | 'end', size?: number, fullSize?: number) => void;
}

export interface RequestDownloadOpt extends RequestInit {
  // 是否stringify参数（非GET请求使用）
  isStringify?: boolean;
  onDown?: (chunk?: Buffer, allLength?: number) => void;
}

/**
 * 对象转参数
 * @param data
 */
export function queryParams(data: any): string {
  let _result = [];
  for (let key in data) {
    let value = data[key];
    if (['', undefined, null].includes(value)) {
      continue;
    }
    if (value.constructor === Array) {
      value.forEach((_value) => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
      });
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  return _result.length ? _result.join('&') : '';
}

interface RequestInit {
  // 是否获取headers
  isHeaders?: boolean;
  headers?: HeadersInit;
  method?: string;
  timeout?: number;
  data?: any;
  type?: 'TEXT' | 'JSON' | 'BUFFER';
  encoding?: BufferEncoding;
  args?: ClientRequestArgs;
}

function dataToFormData(boundary: string, key: string, value: string) {
  return `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
}

function requestInit(
  url: string,
  sendData: ClientRequestArgs = {},
  ing: (response: IncomingMessage) => void
) {
  const isHttp = url.startsWith('http://');
  if (isHttp) return httpRequest(url, sendData, ing);
  return httpsRequest(url, sendData, ing);
}

/**
 * 上传
 * @param url
 * @param sendData
 * @param params
 */
export function upload(url: string, params: RequestUploadOpt) {
  return new Promise((resolve, reject) => {
    params.method = params.method || 'GET';
    params.args = params.args || { method: params.method };
    if (!params.args.method) params.args.method = params.method;
    const boundary = '--' + Math.random().toString(16);
    const headers = Object.assign(
      {
        'content-type': 'multipart/from-data; boundary=' + boundary
      },
      params.headers
    );
    let chunks: Buffer[] = [];
    let size: number = 0;
    function ing(response: IncomingMessage) {
      response.on('data', (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
      });
      response.on('end', () => {
        const data = Buffer.concat(chunks, size);
        resolve(data);
      });
    }
    let request = requestInit(url, params.args, ing);
    for (const header in headers) request.setHeader(header, headers[header] as string);
    if (params.data) {
      for (const i in params.data) {
        request.write(dataToFormData(boundary, i, params.data[i]));
      }
    }
    request.write(
      `--${boundary}\r\nContent-Disposition: form-data; name="${basename(
        params.filePath,
        extname(params.filePath)
      )}"; filename="${basename(params.filePath)}"\r\n\r\n`
    );
    request.on('destroyed', () => {
      reject(new Error('destroy'));
    });
    request.on('error', (err) => {
      reject(err);
    });
    const fileSize = statSync(params.filePath).size;
    const readStream = createReadStream(params.filePath, {
      highWaterMark: 15 * 1024,
      autoClose: true,
      start: 0,
      end: fileSize
    });
    readStream.on('open', () => {
      if (params.onUploadProgress) params.onUploadProgress('open');
    });
    readStream.on('data', () => {
      if (params.onUploadProgress) params.onUploadProgress('ing', readStream.bytesRead, fileSize);
    });
    readStream.on('end', () => {
      if (params.onUploadProgress) params.onUploadProgress('end');
      request.end('\r\n--' + boundary + '--\r\n');
    });
    readStream.pipe(request as unknown as NodeJS.WritableStream, { end: false });
  });
}

/**
 * 下载
 * @param url
 * @param sendData
 * @param params
 */
export function download(url: string, params: RequestDownloadOpt = {}) {
  return new Promise((resolve, reject) => {
    params.method = params.method || 'GET';
    params.args = params.args || { method: params.method };
    params.type = 'BUFFER';
    if (!params.args.method) params.args.method = params.method;
    const headers = Object.assign({}, params.headers);
    let chunks: Buffer[] = [];
    let size: number = 0;
    function ing(response: IncomingMessage) {
      if (response.statusCode && response.statusCode === 301) {
        download(response.headers.location as string, params)
          .then(resolve)
          .catch(reject);
        return;
      }
      const allLength = Number(response.headers['content-length'] || 0);
      response.on('data', (chunk) => {
        if (params.onDown) {
          params.onDown(chunk, allLength);
          return;
        }
        chunks.push(chunk);
        size += chunk.length;
      });
      response.on('end', () => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(response.statusCode + ''));
          return;
        }
        let result: unknown;
        if (params.onDown) {
          result = {
            msg: 'downloaded',
            allLength
          };
        } else result = Buffer.concat(chunks, size);
        if (params.isHeaders) resolve({ data: result, headers: response.headers });
        else resolve(result);
      });
    }
    const request = requestInit(url, params.args, ing);
    request.on('destroyed', () => reject(new Error('destroy')));
    request.on('error', (err) => reject(err));
    for (const header in headers) request.setHeader(header, headers[header] as string);
    if (params.data && params.method !== 'GET') {
      if (typeof params.data !== 'string') {
        const data = params.isStringify ? queryParams(params.data) : JSON.stringify(params.data);
        request.write(data);
      } else request.write(params.data);
    }
    request.end();
  });
}

/**
 * 请求
 * @param url
 * @param params
 */
export default function request<T>(url: string, params: RequestOpt = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    params.method = params.method || 'GET';
    params.args = params.args || { method: params.method };
    if (!params.type) params.type = 'JSON';
    if (!params.timeout) params.timeout = 1000 * 60;
    if (!params.args.method) params.args.method = params.method;
    if (params.data && params.method === 'GET') url += `?${queryParams(params.data)}`;
    const headers = params.headers || { 'content-type': 'application/json;charset=utf-8' };
    let chunks: Buffer[] = [];
    let size: number = 0;
    function ing(response: IncomingMessage) {
      if (response.statusCode && response.statusCode === 301) {
        request<T>(response.headers.location as string, params)
          .then(resolve)
          .catch(reject);
        return;
      }
      response.on('data', (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
      });
      response.on('end', () => {
        const data = Buffer.concat(chunks, size);
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(data.toString()));
          return;
        }
        let result: unknown;
        switch (params.type) {
          case 'BUFFER':
            result = data;
            break;
          case 'JSON':
            try {
              result = JSON.parse(data.toString());
            } catch (e) {
              result = data.toString(params.encoding || 'utf8');
            }
            break;
          case 'TEXT':
            result = data.toString(params.encoding || 'utf8');
            break;
        }
        if (params.isHeaders) resolve({ data: result, headers: response.headers } as unknown as T);
        else resolve(result as unknown as T);
      });
    }
    const req = requestInit(url, params.args, ing);
    req.on('destroyed', () => reject(new Error('destroy')));
    req.on('error', (err) => reject(err));
    for (const header in headers) req.setHeader(header, headers[header] as string);
    if (params.data && params.method !== 'GET') {
      if (typeof params.data !== 'string') {
        const data = params.isStringify ? queryParams(params.data) : JSON.stringify(params.data);
        req.write(data);
      } else req.write(params.data);
    }
    req.end();
  });
}
