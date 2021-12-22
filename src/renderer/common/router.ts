import { h } from '@/renderer/common/h';

export default class Router {
  private instances: { [key: string]: View } = {};

  public appDom: HTMLElement = document.body;
  public routes: Route[] = [];
  // 当前路由
  public current: View | undefined;
  // 路由历史
  public history: { path: string; params?: any }[] = [];
  // 路由监听
  public onBeforeRoute: (route: Route, params?: any) => Promise<boolean> | boolean = () => true;

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
    const route = this.getRoute(p.path);
    if (!route) {
      console.warn(`beyond the history of ${path}`);
      return;
    }
    await this.rIng(route, p.params, false);
  }

  private async rIng(route: Route, params?: any, isHistory: boolean = true) {
    const isR = await this.onBeforeRoute(route, params);
    if (isR)
      await route
        .component()
        .then((View) => this.pretreatment(route, View, params))
        .then(() => isHistory && this.setHistory(route.path, params))
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
        this.instances[this.current.$name as string] = this.current;
        if (this.current.components) {
          for (const componentKey in this.current.components) {
            const component = this.current.components[componentKey];
            component.onDeactivated();
            for (const css of component.styles) css.unuse();
          }
        }
        this.current.onDeactivated();
      } else {
        delete this.instances[this.current.$name as string];
        if (this.current.components) {
          for (const componentKey in this.current.components) {
            const component = this.current.components[componentKey];
            component.onUnmounted();
            for (const css of component.styles) css.unuse();
          }
        }
        this.current.onUnmounted();
      }
      this.appDom.removeChild(this.current.$el as HTMLElement);
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
    const viewEl = h('div', { class: 'container' });
    if (view.render) {
      const cl = view.render();
      if (cl) {
        if (Array.isArray(cl)) for (const v of cl) viewEl.appendChild(v);
        else viewEl.appendChild(cl);
      }
    }
    if (view.components) {
      const componentsEl = h('div', { class: 'view components' });
      for (const componentKey in view.components) {
        const component = view.components[componentKey];
        for (const css of component.styles) css.use();
        component.onLoad();
        const el = h('div', { class: componentKey.toLowerCase() });
        if (component.render) {
          const cl = component.render();
          if (cl) {
            if (Array.isArray(cl)) for (const v of cl) el.appendChild(v);
            else el.appendChild(cl);
          }
        }
        componentsEl.appendChild(el);
        component.$currentName = view.$name as string;
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
