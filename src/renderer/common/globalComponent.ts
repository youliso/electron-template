import { h, renderComponent, unComponent } from '@/renderer/common/h';

class GlobalComponent {
  private static instance: GlobalComponent;
  private el: HTMLElement;

  public components: { [key: string]: Component } = {};

  static getInstance() {
    if (!GlobalComponent.instance) GlobalComponent.instance = new GlobalComponent();
    return GlobalComponent.instance;
  }

  constructor() {
    this.el = h('div', { class: 'global components' });
    document.body.appendChild(this.el);
  }

  async use(mod: Promise<any>, key?: string) {
    await mod.then((node: any) => {
      key = key || (node.default.name as string);
      const component = new node.default() as Component;
      renderComponent(false, component, {
        currentPath: 'global',
        currentEl: this.el,
        key
      });
      this.components[key] = component;
    });
  }

  unuse(key?: string) {
    if (key) {
      const component = this.components[key];
      unComponent(false, component);
      return;
    }
    for (const componentKey in this.components) {
      const component = this.components[componentKey];
      unComponent(false, component);
    }
  }

  get(key?: string) {
    return key ? this.components[key] : this.components;
  }
}

export default GlobalComponent.getInstance();
