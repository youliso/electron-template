import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import { isNull, swapArr } from '@/lib';
import Store from '@/renderer/store';

/**
 *
 */
class Router {
  private static instance: Router;

  public routes: Route[] = [...dialogRoute, ...pageRoute];
  public history: string[] = []; // 路由历史

  static getInstance() {
    if (!Router.instance) Router.instance = new Router();
    return Router.instance;
  }

  constructor() {}

  getRoute(path: string) {
    for (let i = 0, len = this.routes.length; i < len; i++) {
      const route = this.routes[i];
      if (route.path === path) return route;
    }
  }

  setHistory(path: string) {
    const index = this.history.indexOf(path);
    if (index < 0) this.history.unshift(path);
    else swapArr(this.history, index, 0);
  }

  /**
   * 初始路由
   * @param route
   */
  setRoute(route: Route) {
    this.routes.push(route);
  }

  /**
   * 获取当前路由
   */
  getIndex() {
    return this.getRoute(this.history[0]);
  }

  /**
   * 跳转路由
   * @param path
   */
  async go(path: string | number) {
    const appDom = document.getElementById(Store.get<string>('appDom'));
    if (typeof path === 'string') {
      const route = this.getRoute(path);
      await route
        .component()
        .then((e) => {
          while (appDom.hasChildNodes()) {
            appDom.removeChild(appDom.firstChild);
          }
          e.default();
        })
        .then(() => this.setHistory(route.path))
        .catch(console.error);
    } else {
      const num = Math.abs(path) | 0;
      if (num <= 0 || num >= this.history.length) {
        console.warn('beyond the history of the router');
      } else {
        const p = this.history[num];
        if (!isNull(p)) {
          await this.getRoute(p)
            .component()
            .then((e) => {
              while (appDom.hasChildNodes()) {
                appDom.removeChild(appDom.firstChild);
              }
              e.default();
            })
            .then(() => this.setHistory(p))
            .catch(console.error);
        } else console.warn('beyond the history of the router');
      }
    }
  }
}

export default Router.getInstance();
