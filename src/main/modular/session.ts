import { ipcMain, session, CookiesGetFilter, CookiesSetDetails } from 'electron';

/**
 * 监听
 */
export default class Session {
  /**
   * 头部 headers
   * 键值对 => 域名: Headers
   */
  public urlHeaders: { [key: string]: { [key: string]: string } } = {};

  constructor() {}

  /**
   * 拦截指定http/https请求并更换、增加headers
   */
  webRequest() {
    session.defaultSession.webRequest.onBeforeSendHeaders(
      {
        urls: ['http://*/*', 'https://*/*']
      },
      (details, callback) => {
        const urls = Object.keys(this.urlHeaders);
        const keys = urls.filter((key: string) => details.url.indexOf(key) === 0);
        for (const key of keys) {
          for (const v in this.urlHeaders[key]) {
            details.requestHeaders[v] = this.urlHeaders[key][v];
          }
        }
        callback({ requestHeaders: details.requestHeaders });
      }
    );
  }

  /**
   * 设置setUserAgent/acceptLanguages
   * @param userAgent
   * @param acceptLanguages
   */
  setUserAgent(userAgent: string, acceptLanguages?: string) {
    session.defaultSession.setUserAgent(userAgent, acceptLanguages);
  }

  /**
   * 获取 Cookies
   * @param filter
   */
  getCookies(filter: CookiesGetFilter) {
    return session.defaultSession.cookies.get(filter);
  }

  /**
   * 设置 Cookies
   * 如果存在，则会覆盖原先 cookie.
   * @param details
   */
  async setCookies(details: CookiesSetDetails) {
    await session.defaultSession.cookies.set(details);
  }

  /**
   * 移除 Cookies
   * @param url
   * @param name
   */
  async removeCookies(url: string, name: string) {
    await session.defaultSession.cookies.remove(url, name);
  }

  /**
   * 开启监听
   */
  on() {
    this.webRequest();
    //设置url请求头
    ipcMain.on('session-headers-set', async (event, args) => {
      this.urlHeaders = Object.assign(this.urlHeaders, args);
    });
    //设置 Cookies
    ipcMain.handle('session-cookies-set', async (event, args) => this.setCookies(args));
    //获取 Cookies
    ipcMain.handle('session-cookies-get', async (event, args) => this.getCookies(args));
    //移除 Cookies
    ipcMain.handle('session-cookies-remove', async (event, args) =>
      this.removeCookies(args.url, args.name)
    );
  }
}
