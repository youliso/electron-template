import { h } from '@/renderer/common/h';

class GlobalComponent {
  private static instance: GlobalComponent;
  private el: JSX.Element = h('div', { class: 'global components' });

  public components: { [key: string]: Component } = {};

  static getInstance() {
    if (!GlobalComponent.instance) GlobalComponent.instance = new GlobalComponent();
    return GlobalComponent.instance;
  }

  constructor() {
    const element = document.getElementById('root');
    if (!element) throw new Error(`element root null`);
    element.appendChild(this.el);
  }

  private render(component: Component, key: string) {
    component.onLoad && component.onLoad();
    const el = component.render ? component.render() : null;
    component.$currentPath = 'global';
    component.$key = key;
    if (el) {
      component.$el = el;
      this.el.appendChild(el);
    }
    component.onReady && component.onReady();
  }

  private un(component: Component) {
    component.onUnmounted && component.onUnmounted();
    component.$el && this.el.removeChild(component.$el);
  }

  async use(mod: Promise<any>, key?: string) {
    await mod.then((node: any) => {
      key = key || (node.default.name as string);
      const component = new node.default() as Component;
      this.render(component, key);
      this.components[key] = component;
    });
  }

  unuse(key?: string) {
    if (key) {
      const component = this.components[key];
      this.un(component);
      return;
    }
    for (const componentKey in this.components) {
      const component = this.components[componentKey];
      this.un(component);
    }
  }

  get(key?: string) {
    return key ? this.components[key] : this.components;
  }
}

export default GlobalComponent.getInstance();
