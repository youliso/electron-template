import { session } from 'electron';
import { preload } from '@youliso/electronic/main';
export const defaultSessionInit = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ['http://*/*', 'https://*/*']
    },
    (details, callback) => {
      // 请求头部修改
      // details.requestHeaders['Cookie'] = '';
      // details.requestHeaders['Referer'] = '';
      callback({ requestHeaders: details.requestHeaders });
    }
  );
};

/**
 * 获取会话缓存
 * @returns
 */
export const getCacheSize = () => {
  return session.defaultSession.getCacheSize();
};

/**
 * 清除会话缓存
 */
export const clearCache = () => {
  return session.defaultSession.clearCache();
};

export const sessionOn = () => {
  preload.handle('session-get-cache', () => getCacheSize());
  preload.handle('session-clear-cache', () => clearCache());
};
