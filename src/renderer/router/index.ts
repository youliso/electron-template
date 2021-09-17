import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import { domCreateElement } from '@/renderer/common/dom';

export class Router {
  private static instance: Router;
  private instances: { [key: string]: View } = {};

  public appDom: HTMLElement = document.body;
  public routes: Route[] = [...dialogRoute, ...pageRoute];
  // 当前路由
  public current: View;
  // 路由历史
  public history: { path: string; params?: RouteParams }[] = [];

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

  unInstance(name: string) {
    delete this.instances[name];
  }

  async replace(path: string, params?: RouteParams) {
    const route: Route = this.getRoute(path);
    if (!route) console.warn(`beyond the history of ${path}`);
    else await this.rIng(route, params, false);
  }

  /**
   * 跳转路由
   */
  async push(path: string, params?: RouteParams) {
    const route: Route = this.getRoute(path);
    if (!route) console.warn(`beyond the history of ${path}`);
    else await this.rIng(route, params, true);
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
    await this.rIng(this.getRoute(p.path), p.params, false);
  }

  private async rIng(route: Route, params?: RouteParams, isHistory: boolean = true) {
    await route
      .component()
      .then((View) => this.pretreatment(route, View, params))
      .then(() => isHistory && this.setHistory(route.path, params))
      .catch(console.error);
  }

  private pretreatment(route: Route, View: any, params?: RouteParams) {
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
            this.current.components[componentKey].onDeactivated();
          }
        }
        this.current.onDeactivated();
      } else {
        delete this.instances[this.current.$name];
        if (this.current.components) {
          for (const componentKey in this.current.components) {
            this.current.components[componentKey].onUnmounted();
          }
        }
        this.current.onUnmounted();
      }
      this.appDom.removeChild(this.current.$el);
      delete this.current;
    }
  }

  private renderView(view: View, params?: RouteParams) {
    if (view.$el) {
      if (view.components) {
        for (const componentKey in view.components) {
          view.components[componentKey].onActivated(params);
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
      const componentsEl = domCreateElement('div', 'components');
      for (const componentKey in view.components) {
        const component = view.components[componentKey];
        component.onLoad();
        const el = domCreateElement('div', `component ${componentKey.toLowerCase()}`);
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

export default Router.getInstance();
