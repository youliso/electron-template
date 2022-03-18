import { renderView, unView } from '@/renderer/common/h';
import { queryParams, toParams } from '@/utils';

export default class Router {
  private instances: { [key: string]: View } = {};

  public type: 'history' | 'hash' | 'inner';
  // 当前路由挂载dom
  public element: HTMLElement | null;
  public routes: Route[] = [];
  // 当前路由
  public current: View | undefined;
  // 路由历史
  public history: { path: string; query?: any }[] = [];
  // 路由监听
  public onBeforeRoute: (route: Route, query?: any) => Promise<boolean> | boolean = () => true;
  public onAfterRoute: (route: Route, query?: any) => Promise<void> | void = () => {};

  constructor(type: 'history' | 'hash' | 'inner', routes: Route[], elementId: string = 'root') {
    this.type = type;
    this.type === 'history' && this.historyR();
    this.element = document.getElementById(elementId);
    if (!this.element) throw new Error(`element ${elementId} null`);
    this.routes.push(...routes);
  }

  private historyR() {
    window.onpopstate = (e) => {
      this.replace(document.location.pathname + document.location.search, e.state).catch(
        console.error
      );
    };
  }

  private hashR(path: string, url: string, query?: any) {
    this.history.unshift({ path, query });
    location.hash = url;
  }

  private innerR(path: string, query?: any) {
    this.history.unshift({ path, query });
  }

  init(path?: string) {
    if (this.type === 'hash') path = path || location.hash.substring(1);
    else if (this.type === 'history')
      path = path || document.location.pathname + document.location.search;
    this.replace(path || '/').catch(console.error);
  }

  getRoute(path: string) {
    for (let i = 0, len = this.routes.length; i < len; i++) {
      const route = this.routes[i];
      if (route.path === path) return route;
    }
    return null;
  }

  setRoute(route: Route | Route[]) {
    if (Array.isArray(route)) this.routes.push(...route);
    else this.routes.push(route);
  }

  unInstance(name: string) {
    delete this.instances[name];
  }

  async replace(path: string, params?: any, instance: boolean = false) {
    const paths = path.split('?');
    const query = toParams(paths[1]);
    const route = this.getRoute(paths[0]);
    if (!route) {
      console.warn(`beyond the history of ${path}`);
      return;
    }
    instance && (route.instance = instance);
    await this.rIng('replace', route, query, params);
  }

  /**
   * 跳转路由
   */
  async push(path: string, params?: any, instance: boolean = false) {
    const paths = path.split('?');
    const query = toParams(paths[1]);
    const route = this.getRoute(paths[0]);
    if (!route) {
      console.warn(`beyond the history of ${path}`);
      return;
    }
    instance && (route.instance = instance);
    await this.rIng('push', route, query, params);
  }

  /**
   * 回退路由
   */
  async back() {
    if (this.type === 'history') {
      history.back();
      return;
    }
    let p = this.history[1];
    if (!p) {
      this.replace('/');
      return;
    }
    const route = this.getRoute(p.path);
    if (!route) {
      console.error(`beyond the history of ${p}`);
      return;
    }
    await this.rIng('back', route, p.query, false);
  }

  /**
   * 跳路由
   */
  async go(num: number = 1) {
    if (this.type === 'history') {
      history.go(num);
      return;
    }
    num < 0 && (num = -num);
    let p = this.history[num];
    if (!p) {
      console.error(`beyond the history of back(${num})`);
      return;
    }
    const route = this.getRoute(p.path);
    if (!route) {
      console.error(`beyond the history of ${p}`);
      return;
    }
    await this.rIng(`go${num}`, route, p.query);
  }

  private async rIng(type: string, route: Route, query?: any, params?: any) {
    const isR = await this.onBeforeRoute(route, query);
    if (!isR) return;
    const component = route.component.prototype
      ? route.component
      : (await route.component()).default;
    let view: View | undefined;
    let isLoad: boolean = false;
    route.instance && (view = this.instances[route.path]);
    view && (isLoad = true);
    if (!isLoad) {
      view = new component() as View;
      view.$instance = route.instance || false;
      !view.$path && (view.$path = route.path);
    }
    const next = async () => {
      this.unCurrent();
      renderView(isLoad, this.element as HTMLElement, view as View, query, params);
      route.name && (document.title = route.name);
      this.current = view;
      const p = queryParams(query);
      const url = `${route.path}${p ? '?' + p : ''}`;
      if (this.type === 'history') {
        switch (type) {
          case 'replace':
            history.replaceState(params, route.name || route.path, url);
            break;
          case 'push':
            history.pushState(params, route.name || route.path, url);
            break;
        }
      } else {
        type.startsWith('go') && this.history.splice(0, Number(this.type.slice(2)));
        type === 'back' && this.history.splice(0, 1);
        this.type === 'hash' && this.hashR(route.path, url, query);
        this.type === 'inner' && this.innerR(route.path, query);
      }
      await this.onAfterRoute(route, query);
    };
    if (this.current && this.current.beforeRoute)
      this.current.beforeRoute(this.current.$path as string, route.path, next) && next();
    else next();
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
