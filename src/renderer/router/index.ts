import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import { isNull, swapArr } from '@/lib';
import Dom from '@/renderer/utils/dom';

export interface RouteParams {
  // 参数
  params?: any;
}

export class Router {
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
    return null;
  }

  setHistory(path: string) {
    const index = this.history.indexOf(path);
    if (index < 0) this.history.unshift(path);
    else swapArr(this.history, index, 0);
  }

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
   * @param params
   */
  async go(path: string | number, params?: RouteParams) {
    let route: Route = null;
    if (typeof path === 'string') {
      route = this.getRoute(path);
    } else {
      const num = Math.abs(path) | 0;
      if (num > 0 || num < this.history.length) {
        const p = this.history[num];
        if (!isNull(p)) route = this.getRoute(p);
      }
    }
    if (!route) console.warn('beyond the history of the router');
    else
      await route
        .component()
        .then((e) => Dom.renderRouter(e.default()))
        .then(() => this.setHistory(route.path))
        .catch(console.error);
  }
}

export default Router.getInstance();
