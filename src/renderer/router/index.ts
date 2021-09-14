import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';

export class Router {
  private static instance: Router;

  public appDom: HTMLElement = null;
  public instances: { [key: string]: View } = {};
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

  /**
   * 初始dom
   */
  init(el: string, route?: string) {
    this.appDom = document.getElementById(el);
    if (route) this.replace(route).catch(console.error);
  }

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
    else await this.rIng(route, params);
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
    await this.rIng(this.getRoute(p.path), p.params);
  }

  async rIng(route: Route, params?: RouteParams, isHistory: boolean = true) {
    await route
      .component()
      .then((View) => {
        if (route.instance) {
          let view = this.instances[View.default.name];
          const initLoad = !view;
          if (initLoad) {
            view = new View.default() as View;
            view.$instance = true;
            if (!view.$name) view.$name = View.default.name;
          }
          const oldVc = this.getCurrentDom(params?.unInstance);
          if (initLoad) view.onLoad(params);
          else view.onActivated(params);
          this.renderView(view, params, oldVc);
          this.current = view;
          if (initLoad) this.instances[view.$name] = view;
          if (initLoad && view.onReady) view.onReady();
          return;
        }
        const view = new View.default() as View;
        if (!view.$name) view.$name = View.default.name;
        const oldVc = this.getCurrentDom(params?.unInstance);
        view.onLoad(params);
        this.renderView(view, params, oldVc);
        this.current = view;
        if (view.onReady) view.onReady();
      })
      .then(() => {
        if (isHistory) this.setHistory(route.path, params);
      })
      .catch(console.error);
  }

  getCurrentDom(instance?: boolean) {
    let oldVc: OldVCKey = null;
    if (this.current) {
      if (instance === null || instance === undefined) instance = this.current.$instance;
      else instance = !instance;
      if (instance) {
        if (this.current.components) {
          for (const componentKey in this.current.components) {
            const c = this.current.components[componentKey];
            if (c.onDeactivated) c.onDeactivated();
          }
        }
        if (this.current.onDeactivated) this.current.onDeactivated();
      } else {
        delete this.instances[this.current.$name];
        if (this.current.components) {
          for (const componentKey in this.current.components) {
            const c = this.current.components[componentKey];
            if (c.onDeactivated) c.onUnmounted();
          }
        }
        this.current.onUnmounted();
      }
      let o: OldVCKey = {
        c: [],
        v: `v-${this.current.$name}`
      };
      if (this.current.components) o.c = Object.keys(this.current.components).map((c) => `c-${c}`);
      oldVc = o;
      delete this.current;
    }
    return oldVc;
  }

  renderComponent(currentName: string, componentKey: string, component: Component) {
    component.onLoad();
    const el = component.render();
    el.setAttribute('id', `c-${componentKey}`);
    this.appDom.appendChild(el);
    component.$currentName = currentName;
    component.$name = componentKey;
    component.$el = el;
    if (component.onReady) component.onReady();
    return component;
  }

  renderView(view: View, params?: RouteParams, oldVc?: OldVCKey) {
    if (oldVc) {
      for (const i of oldVc.c) {
        this.appDom.removeChild(document.getElementById(i));
      }
      this.appDom.removeChild(document.getElementById(oldVc.v));
    }
    if (view.$el) {
      this.appDom.appendChild(view.$el);
      if (view.components) {
        for (const componentKey in view.components) {
          const c = view.components[componentKey];
          if (c.onActivated) c.onActivated(params);
          this.appDom.appendChild(c.$el);
        }
      }
      return;
    }
    const el = view.render();
    el.setAttribute('id', `v-${view.$name}`);
    this.appDom.appendChild(el);
    if (view.components) {
      for (const componentKey in view.components) {
        view.components[componentKey] = this.renderComponent(
          view.$name,
          componentKey,
          view.components[componentKey]
        );
      }
    }
    view.$el = el;
  }
}

export default Router.getInstance();
