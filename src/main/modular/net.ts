import type { ClientRequestConstructorOptions, ClientRequest } from 'electron';
import { net } from 'electron';
import { createReadStream, statSync } from 'fs';
import { basename, extname } from 'path';
import querystring from 'querystring';

const { timeout, appUrl } = require('@/cfg/net.json');

export enum NET_RESPONSE_TYPE {
  TEXT,
  JSON,
  BUFFER
}

export interface NetOpt extends ClientRequestConstructorOptions {
  authorization?: string;
  isStringify?: boolean; //是否stringify参数（非GET请求使用）
  isHeaders?: boolean; //是否获取headers
  headers?: { [key: string]: string };
  encoding?: BufferEncoding;
  onRequest?: (abort: ClientRequest) => void;
  data?: any;
  type?: NET_RESPONSE_TYPE;
  timeout?: number;
}

export interface UploadOpt {
  filePath: string;
  fileName?: string;
  onUploadProgress?: (status: string, size?: number, fullSize?: number) => void;
  data?: { [key: string]: string };
  headers?: { [key: string]: string };
}

export function request<T>(url: string, params: NetOpt = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = appUrl + url;
    let sendData: ClientRequestConstructorOptions = {
      url,
      method: params.method || 'GET'
    };
    const headers = Object.assign(
      {
        'content-type': 'application/json;charset=utf-8',
        authorization: params.authorization || ''
      },
      params.headers
    );
    if (!params.type) params.type = NET_RESPONSE_TYPE.JSON;
    if (params.data && sendData.method === 'GET') {
      sendData.url += `?${querystring.stringify(params.data)}`;
    }
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
        let result: unknown | T;
        switch (params.type) {
          case NET_RESPONSE_TYPE.BUFFER:
            result = data;
            break;
          case NET_RESPONSE_TYPE.JSON:
            result = JSON.parse(data.toString());
            break;
          case NET_RESPONSE_TYPE.TEXT:
            result = data.toString(params.encoding || 'utf8');
            break;
        }
        if (params.isHeaders) resolve({ data: result, headers: response.headers } as unknown as T);
        else resolve(result as unknown as T);
      });
    });
    if (params.data && sendData.method !== 'GET') {
      const data = params.isStringify
        ? querystring.stringify(params.data)
        : JSON.stringify(params.data);
      if (typeof params.data !== 'string') request.write(data);
      else request.write(data);
    }
    request.end();
    if (params.onRequest) params.onRequest(request);
    setTimeout(() => request.abort(), params.timeout || timeout);
  });
}

export function upload(url: string, params: UploadOpt) {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = appUrl + url;
    let sendData: ClientRequestConstructorOptions = {
      url
    };
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

function dataToFormData(boundary: string, key: string, value: string) {
  return `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
}
