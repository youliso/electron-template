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

  render(key: string, component: Component) {
    renderComponent(false, component, {
      currentName: 'global',
      currentEl: this.el,
      key
    });
    this.components[key] = component;
  }

  get(key?: string) {
    return key ? this.components[key] : this.components;
  }

  unRender(key?: string) {
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
}

export default GlobalComponent.getInstance();
