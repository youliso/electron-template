import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import Dom from '@/renderer/utils/dom';

export class Router {
  private static instance: Router;

  public routes: Route[] = [...dialogRoute, ...pageRoute];
  public current: any; // 当前路由
  public history: { path: string; params?: RouteParams }[] = []; // 路由历史

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

  setHistory(path: string, params?: RouteParams) {
    this.history.unshift({ path, params });
  }

  setRoute(route: Route) {
    this.routes.push(route);
  }

  async r(route: Route, params?: RouteParams, isHistory: boolean = true) {
    await route
      .component()
      .then((e) => {
        if (this.current?.onUnmounted) {
          this.current?.onUnmounted();
          delete this.current;
        }
        if (e?.onLoad) e.onLoad();
        Dom.renderRouter(e.default(params));
        if (e?.onReady) e.onReady();
        this.current = e;
      })
      .then(() => {
        if (isHistory) this.setHistory(route.path, params);
      })
      .catch(console.error);
  }

  async replace(path: string, params?: RouteParams) {
    const route: Route = this.getRoute(path);
    if (!route) console.warn(`beyond the history of ${path}`);
    else await this.r(route, params, false);
  }

  /**
   * 跳转路由
   */
  async push(path: string, params?: RouteParams) {
    const route: Route = this.getRoute(path);
    if (!route) console.warn(`beyond the history of ${path}`);
    else await this.r(route, params);
  }

  /**
   * 回退路由
   */
  async back(path: number, params?: RouteParams) {
    let num = Math.abs(path) | 0;
    let p = this.history[num];
    if (!p) {
      console.warn(`beyond the history of back(${path})`);
      num = this.history.length - 1;
      p = this.history[num];
    }
    if (params) p.params = params;
    this.history.splice(0, num + 1);
    await this.r(this.getRoute(p.path), p.params);
  }
}

export default Router.getInstance();
