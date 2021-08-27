import { CookiesGetFilter, CookiesSetDetails } from 'electron';

/**
 * 设置http/https指定域名请求头
 * 键值对 => 域名: Headers
 */
export function sessionHeadersSet(args: { [key: string]: { [key: string]: string } }) {
  window.ipc.send('session-headers-set', args);
}

/**
 * 获取 cookies
 * @param args
 */
export function sessionCookiesGet(args: CookiesGetFilter) {
  return window.ipc.invoke('session-cookies-get', args);
}

/**
 * 设置 cookies
 * @param args
 */
export async function sessionCookiesSet(args: CookiesSetDetails) {
  return window.ipc.invoke('session-cookies-set', args);
}

/**
 * 移除 Cookies
 * @param url
 * @param name
 */
export async function sessionCookiesRemove(url: string, name: string) {
  return window.ipc.invoke('session-cookies-remove', { url, name });
}
