import { domCreateElement } from '@/renderer/common/dom';

export default class Router {
  private instances: { [key: string]: View } = {};

  public appDom: HTMLElement = document.body;
  public routes: Route[] = [];
  // 当前路由
  public current: View;
  // 路由历史
  public history: { path: string; params?: any }[] = [];
  // 路由监听
  public onRoute: (route: Route, params?: any) => void;

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
    const route: Route = this.getRoute(path);
    if (instance) route.instance = instance;
    if (!route) console.warn(`beyond the history of ${path}`);
    else await this.rIng(route, params, false);
  }

  /**
   * 跳转路由
   */
  async push(path: string, params?: any, instance: boolean = false) {
    const route: Route = this.getRoute(path);
    if (instance) route.instance = instance;
    if (!route) console.warn(`beyond the history of ${path}`);
    else await this.rIng(route, params, true);
  }

  /**
   * 回退路由
   */
  async back(path: number = -1, params?: any) {
    let num = Math.abs(path) | 0;
    let p = this.history[num];
    if (!p) {
      console.warn(`beyond the history of back(${path})`);
      num = this.history.length - 1;
      p = this.history[num];
    }
    if (params) p.params = params;
    this.history.splice(0, num);
    await this.rIng(this.getRoute(p.path), p.params, false);
  }

  private async rIng(route: Route, params?: any, isHistory: boolean = true) {
    await route
      .component()
      .then((View) => this.pretreatment(route, View, params))
      .then(() => isHistory && this.setHistory(route.path, params))
      .then(() => this.onRoute && this.onRoute(route, params))
      .catch(console.error);
  }

  private pretreatment(route: Route, View: any, params?: any) {
    let view: View;
    if (route.instance) {
      view = this.instances[View.default.name];
      const initLoad = !this.instances[View.default.name];
      if (initLoad) {
        view = new View.default() as View;
        view.$instance = true;
        if (!view.$name) view.$name = View.default.name;
      }
      this.unCurrent();
      for (const css of view.styles) css.use();
      if (initLoad) view.onLoad(params);
      else view.onActivated(params);
      this.renderView(view, params);
      this.current = view;
      if (initLoad) view.onReady();
      return;
    }
    view = new View.default() as View;
    if (!view.$name) view.$name = View.default.name;
    this.unCurrent();
    for (const css of view.styles) css.use();
    view.onLoad(params);
    this.renderView(view, params);
    this.current = view;
    view.onReady();
  }

  private unCurrent() {
    if (this.current) {
      if (this.current.$instance) {
        this.instances[this.current.$name] = this.current;
        if (this.current.components) {
          for (const componentKey in this.current.components) {
            const component = this.current.components[componentKey];
            component.onDeactivated();
            for (const css of component.styles) css.unuse();
          }
        }
        this.current.onDeactivated();
      } else {
        delete this.instances[this.current.$name];
        if (this.current.components) {
          for (const componentKey in this.current.components) {
            const component = this.current.components[componentKey];
            component.onUnmounted();
            for (const css of component.styles) css.unuse();
          }
        }
        this.current.onUnmounted();
      }
      this.appDom.removeChild(this.current.$el);
      for (const css of this.current.styles) css.unuse();
      delete this.current;
    }
  }

  private renderView(view: View, params?: any) {
    if (view.$el) {
      if (view.components) {
        for (const componentKey in view.components) {
          const component = view.components[componentKey];
          for (const css of component.styles) css.use();
          component.onActivated(params);
        }
      }
      this.appDom.appendChild(view.$el);
      return;
    }
    const viewEl = domCreateElement('div', 'container');
    const cl = view.render();
    if (Array.isArray(cl)) for (const v of cl) viewEl.appendChild(v);
    else viewEl.appendChild(cl);
    if (view.components) {
      const componentsEl = domCreateElement('div', 'view components');
      for (const componentKey in view.components) {
        const component = view.components[componentKey];
        for (const css of component.styles) css.use();
        component.onLoad();
        const el = domCreateElement('div', componentKey.toLowerCase());
        const cl = component.render();
        if (Array.isArray(cl)) for (const v of cl) el.appendChild(v);
        else el.appendChild(cl);
        componentsEl.appendChild(el);
        component.$currentName = view.$name;
        component.$name = componentKey;
        component.$el = el;
        component.onReady();
      }
      viewEl.appendChild(componentsEl);
    }
    this.appDom.appendChild(viewEl);
    view.$el = viewEl;
  }
}
