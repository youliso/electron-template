import { renderView, unView } from '@/renderer/common/h';
import { queryParams, toParams } from '@/utils';

export default class Router {
  private instances: { [key: string]: View } = {};

  public type: 'history' | 'hash' | 'inner';
  // 当前路由挂载dom
  public element: HTMLElement | null;
  public routes: Route[] = [];
  // 当前路由
  public currentView: View | undefined;
  // 路由历史
  public currentPath: string = '';
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
    }
    const next = async () => {
      this.unCurrent();
      renderView(isLoad, this.element as HTMLElement, view as View, query, params);
      route.name && (document.title = route.name);
      this.currentPath = route.path;
      this.currentView = view;
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
    if (this.currentView && this.currentView.beforeRoute)
      this.currentView.beforeRoute(this.currentPath as string, route.path, next) && next();
    else next();
  }

  private unCurrent() {
    if (!this.currentView) return;
    if (this.currentView.$instance) {
      this.instances[this.currentPath as string] = this.currentView;
      unView(true, this.currentView);
    } else {
      delete this.instances[this.currentPath as string];
      unView(false, this.currentView);
    }
    delete this.currentView;
  }
}

export class ChildRoute {
  public routeKey: string;
  public routes: { [key: string]: any } = {};
  public el: JSX.Element;

  constructor(routes: { [key: string]: any }, routeKey: string, el: JSX.Element) {
    this.routes = routes;
    this.el = el;
    this.routeKey = routeKey;
    this.rIng();
  }

  private rIng() {
    this.routes[this.routeKey].onLoad && this.routes[this.routeKey].onLoad();
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
    this.el.appendChild(this.routes[this.routeKey].render());
    this.routes[this.routeKey].onReady && this.routes[this.routeKey].onReady();
  }

  to(path: string) {
    if (this.routeKey === path || !this.routes[this.routeKey]) return;
    this.routes[this.routeKey].onUnmounted();
    this.routeKey = path;
    this.rIng();
  }

  render() {
    return this.el;
  }
}
