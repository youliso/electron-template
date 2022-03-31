import { renderView, unView } from '@/renderer/common/h';
import { queryParams, toParams } from '@/utils';

export default class Router {
  private instances: { [key: string]: View } = {};

  public type: 'history' | 'hash' | 'inner';
  // 当前路由挂载dom
  public element: HTMLElement | null;
  public routes: Route[] = [];
  // 当前
  public currentView: View | undefined;
  public currentPath: string = '';
  public currentParame: ViewParameters = {};
  // 路由历史
  public history: { path: string; parame: ViewParameters }[] = [];
  // 路由监听
  public onBeforeRoute: (route: Route, parame?: ViewParameters) => Promise<boolean> | boolean =
    () => true;
  public onAfterRoute: (route: Route, parame?: ViewParameters) => Promise<void> | void = () => {};

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

  private hashR(path: string, url: string, parame?: ViewParameters) {
    this.history.unshift({ path, parame: parame || this.currentParame });
    location.hash = url;
  }

  private innerR(path: string, parame?: ViewParameters) {
    this.history.unshift({ path, parame: parame || this.currentParame });
  }

  routerState(args: { key: string; path: string } | null) {
    if (!args) return;
    this.currentParame?.query
      ? (this.currentParame.query[args.key] = args.path)
      : (this.currentParame.query = { [args.key]: args.path });
    const p = queryParams(this.currentParame.query);
    const url = `${this.currentPath}${p ? '?' + p : ''}`;
    if (this.type === 'history') {
      history.replaceState(this.currentParame.params, document.title || this.currentPath, url);
    } else {
      this.type === 'hash' && this.hashR(this.currentPath, url);
      this.type === 'inner' && this.innerR(this.currentPath);
    }
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

  async replace(args: string, params?: any, instance: boolean = false) {
    const arg = args.split('?');
    const query = toParams(arg[1]);
    const route = this.getRoute(arg[0]);
    if (!route) {
      console.error(`beyond the history of ${arg[0]}`);
      return;
    }
    instance && (route.instance = instance);
    await this.rIng('replace', route, { params, query });
  }

  /**
   * 跳转路由
   */
  async push(args: string, params?: any, instance: boolean = false) {
    const arg = args.split('?');
    const query = toParams(arg[1]);
    const route = this.getRoute(arg[0]);
    if (!route) {
      console.error(`beyond the history of ${arg[0]}`);
      return;
    }
    instance && (route.instance = instance);
    await this.rIng('push', route, { params, query });
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
    await this.rIng('back', route, p.parame);
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
    await this.rIng(`go${num}`, route, p.parame);
  }

  private async rIng(type: string, route: Route, parame: ViewParameters = {}) {
    const isR = await this.onBeforeRoute(route, parame);
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
      renderView(isLoad, this.element as HTMLElement, view as View, parame);
      route.name && (document.title = route.name);
      this.currentPath = route.path;
      this.currentView = view;
      this.currentParame = parame;
      const p = queryParams(parame.query);
      const url = `${route.path}${p ? '?' + p : ''}`;
      if (this.type === 'history') {
        switch (type) {
          case 'replace':
            history.replaceState(parame.params, route.name || route.path, url);
            break;
          case 'push':
            history.pushState(parame.params, route.name || route.path, url);
            break;
        }
      } else {
        type.startsWith('go') && this.history.splice(0, Number(this.type.slice(2)));
        type === 'back' && this.history.splice(0, 1);
        this.type === 'hash' && this.hashR(route.path, url, parame);
        this.type === 'inner' && this.innerR(route.path, parame);
      }
      await this.onAfterRoute(route, parame);
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
  public urlKey: string;
  public routes: { [key: string]: any } = {};
  public el: JSX.Element;

  constructor(
    routes: { [key: string]: any },
    routeKey: string,
    el: JSX.Element,
    urlKey: string = 'childRoutePath'
  ) {
    this.routes = routes;
    this.el = el;
    this.routeKey = routeKey;
    this.urlKey = urlKey;
    this.rIng();
  }

  private rIng(parame?: ViewParameters) {
    this.routes[this.routeKey].onLoad && this.routes[this.routeKey].onLoad(parame);
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
    this.el.appendChild(this.routes[this.routeKey].render());
    this.routes[this.routeKey].onReady && this.routes[this.routeKey].onReady();
  }

  load(parame: ViewParameters) {
    if (!parame?.query || !parame?.query[this.urlKey]) return null;
    return this.to(parame.query[this.urlKey]);
  }

  to(childRoutePath: string, parame?: ViewParameters) {
    if (this.routeKey === childRoutePath || !this.routes[childRoutePath]) return null;
    this.routes[this.routeKey].onUnmounted && this.routes[this.routeKey].onUnmounted();
    this.routeKey = childRoutePath;
    this.rIng(parame);
    return { key: this.urlKey, path: childRoutePath };
  }

  render() {
    return this.el;
  }
}
