import type { ClientRequestConstructorOptions, ClientRequest } from 'electron';
import { net } from 'electron';
import { createReadStream, statSync } from 'fs';
import { basename, extname } from 'path';
import { queryParams } from '@/utils';

const { timeout, appUrl } = require('@/cfg/net.json');

export interface NetOpt extends ClientRequestConstructorOptions {
  // 是否stringify参数（非GET请求使用）
  isStringify?: boolean;
  // 是否获取headers
  isHeaders?: boolean;
  onRequest?: (request: ClientRequest) => void;
  headers?: { [key: string]: string };
  timeout?: number;
  data?: any;
  type?: 'TEXT' | 'JSON' | 'BUFFER';
  encoding?: BufferEncoding;
  // 是否下载请求
  isDownload?: boolean;
  onDownload?: (chunk?: Buffer, length?: number) => void;
  // 是否上传请求
  isUpload?: boolean;
  filePath?: string;
  fileName?: string;
  onUploadProgress?: (status: 'open' | 'ing' | 'end', size?: number, fullSize?: number) => void;
}

function dataToFormData(boundary: string, key: string, value: string) {
  return `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
}

/**
 * 上传
 * @param sendData
 * @param params
 */
function upload(sendData: ClientRequestConstructorOptions, params: NetOpt = {}) {
  return new Promise((resolve, reject) => {
    const boundary = '--' + Math.random().toString(16);
    const headers = Object.assign(
      {
        'content-type': 'multipart/from-data; boundary=' + boundary
      },
      params.headers
    );
    if (!params.fileName) params.fileName = basename(params.filePath, extname(params.filePath));
    let chunks: Buffer[] = [];
    let size: number = 0;
    const request = net.request(sendData);
    for (const header in headers) request.setHeader(header, headers[header]);
    if (params.data) {
      for (const i in params.data) {
        request.write(dataToFormData(boundary, i, params.data[i]));
      }
    }
    request.write(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${params.fileName}"\r\n\r\n`
    );
    request.on('abort', () => {
      reject(new Error('abort'));
    });
    request.on('error', (err) => {
      reject(err);
    });
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
      });
      response.on('end', () => {
        const data = Buffer.concat(chunks, size);
        resolve(data);
      });
    });
    const fileSize = statSync(params.filePath).size;
    const readStream = createReadStream(params.fileName, {
      highWaterMark: 15 * 1024,
      autoClose: true,
      start: 0,
      end: fileSize
    });
    const isOnUploadProgress: boolean = !!params.onUploadProgress;
    readStream.on('open', () => {
      if (isOnUploadProgress) params.onUploadProgress('open');
    });
    readStream.on('data', () => {
      if (isOnUploadProgress) params.onUploadProgress('ing', readStream.bytesRead, fileSize);
    });
    readStream.on('end', () => {
      if (isOnUploadProgress) params.onUploadProgress('end');
      request.end('\r\n--' + boundary + '--\r\n');
    });
    readStream.pipe(request as unknown as NodeJS.WritableStream, { end: false });
  });
}

/**
 * 下载
 * @param sendData
 * @param params
 */
function download(sendData: ClientRequestConstructorOptions, params: NetOpt = {}) {
  return new Promise((resolve, reject) => {
    const headers = Object.assign({}, params.headers);
    params.type = 'BUFFER';
    let chunks: Buffer[] = [];
    let size: number = 0;
    const request = net.request(sendData);
    for (const header in headers) request.setHeader(header, headers[header]);
    request.on('abort', () => {
      reject(new Error('abort'));
    });
    request.on('error', (err) => {
      reject(err);
    });
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        if (params.onDownload) {
          params.onDownload(chunk, Number(response.headers['content-length'] || 0));
          return;
        }
        chunks.push(chunk);
        size += chunk.length;
      });
      response.on('end', () => {
        if (response.statusCode >= 400) {
          reject(new Error('error'));
          return;
        }
        let result: unknown;
        if (params.onDownload) {
          result = {
            msg: 'downloaded',
            length: Number(response.headers['content-length'] || 0)
          };
        } else {
          result = Buffer.concat(chunks, size);
        }
        if (params.isHeaders) resolve({ data: result, headers: response.headers });
        else resolve(result);
      });
    });
    request.end();
    if (params.onRequest) params.onRequest(request);
    if (!params.isDownload) setTimeout(() => request.abort(), params.timeout || timeout);
  });
}

/**
 * 请求
 * @param url
 * @param params
 */
export default function request<T>(url: string, params: NetOpt = {}): Promise<T> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = appUrl + url;
  let sendData: ClientRequestConstructorOptions = {
    url,
    method: params.method || 'GET'
  };
  if (!params.isUpload && params.data && sendData.method === 'GET') {
    sendData.url += `?${queryParams(params.data)}`;
  }
  if (params.isUpload) {
    return upload(sendData, params) as Promise<T>;
  }
  if (params.isDownload) {
    return download(sendData, params) as Promise<T>;
  }
  return new Promise((resolve, reject) => {
    const headers = Object.assign(
      {
        'content-type': 'application/json;charset=utf-8'
      },
      params.headers
    );
    if (!params.type) params.type = 'JSON';
    let chunks: Buffer[] = [];
    let size: number = 0;
    const request = net.request(sendData);
    for (const header in headers) request.setHeader(header, headers[header]);
    request.on('abort', () => {
      reject(new Error('abort'));
    });
    request.on('error', (err) => {
      reject(err);
    });
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
      });
      response.on('end', () => {
        const data = Buffer.concat(chunks, size);
        if (response.statusCode >= 400) {
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
    });
    if (params.data && sendData.method !== 'GET') {
      if (typeof params.data !== 'string') {
        const data = params.isStringify ? queryParams(params.data) : JSON.stringify(params.data);
        request.write(data);
      } else request.write(params.data);
    }
    request.end();
    if (params.onRequest) params.onRequest(request);
    setTimeout(() => request.abort(), params.timeout || timeout);
  });
}
