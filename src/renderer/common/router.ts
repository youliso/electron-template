import { renderView, unView } from '@/renderer/common/h';

export default class Router {
  private instances: { [key: string]: View } = {};

  public routes: Route[] = [];
  // 当前路由
  public current: View | undefined;
  // 路由历史
  public history: { path: string; params?: any }[] = [];
  // 路由监听
  public onBeforeRoute: (route: Route, params?: any) => Promise<boolean> | boolean = () => true;
  public onAfterRoute: (route: Route, params?: any) => Promise<void> | void = () => {};

  constructor(routes: Route[]) {
    this.routes.push(...routes);
  }

  getRoute(path: string) {
    for (let i = 0, len = this.routes.length; i < len; i++) {
      const route = this.routes[i];
      if (route.path === path) return route;
    }
    return null;
  }

  setHistory(path: string, params?: any) {
    this.history.unshift({ path, params });
  }

  setRoute(route: Route | Route[]) {
    if (Array.isArray(route)) this.routes.push(...route);
    else this.routes.push(route);
  }

  unInstance(name: string) {
    delete this.instances[name];
  }

  async replace(path: string, params?: any, instance: boolean = false) {
    const route = this.getRoute(path);
    if (!route) {
      console.warn(`beyond the history of ${path}`);
      return;
    }
    if (instance) route.instance = instance;
    await this.rIng(route, params, false);
  }

  /**
   * 跳转路由
   */
  async push(path: string, params?: any, instance: boolean = false) {
    const route = this.getRoute(path);
    if (!route) {
      console.warn(`beyond the history of ${path}`);
      return;
    }
    if (instance) route.instance = instance;
    await this.rIng(route, params, true);
  }

  /**
   * 回退路由
   */
  async back(num: number = 1, params?: any) {
    let p = this.history[num];
    if (!p) {
      console.error(`beyond the history of back(${num})`);
      return;
    }
    p.params = params;
    this.history.splice(0, num);
    const route = this.getRoute(p.path);
    if (!route) {
      console.error(`beyond the history of ${p}`);
      return;
    }
    await this.rIng(route, p.params, false);
  }

  private async rIng(route: Route, params?: any, isHistory: boolean = true) {
    const isR = await this.onBeforeRoute(route, params);
    if (!isR) return;
    const component = route.component.prototype
      ? route.component
      : (await route.component()).default;
    let view: View | undefined;
    let isLoad: boolean = false;
    if (route.instance) view = this.instances[route.path];
    if (view) isLoad = true;
    if (!isLoad) {
      view = new component() as View;
      view.$instance = route.instance || false;
      if (!view.$path) view.$path = route.path;
    }
    if (this.current) this.unCurrent();
    renderView(isLoad, view as View, params);
    if (route.title) document.title = route.title;
    this.current = view;
    isHistory && this.setHistory(route.path, params);
    await this.onAfterRoute(route, params);
  }

  private unCurrent() {
    if (!this.current) return;
    if (this.current.$instance) {
      this.instances[this.current.$path as string] = this.current;
      unView(true, this.current);
    } else {
      delete this.instances[this.current.$path as string];
      unView(false, this.current);
    }
    delete this.current;
  }
}
