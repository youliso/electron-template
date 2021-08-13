import { getGlobal } from './';
import { isNull } from '@/lib';
import { windowShow } from '@/renderer/utils/window';
import Store from '@/renderer/store';

/**
 * 页面初始化加载
 */
export function domPropertyLoad() {
  const accent = getGlobal<{ [key: string]: string[] & { [key: string]: string } }>('app.dom');
  for (let i in accent) {
    if (i === 'class') {
      domClassPropertySet(accent[i].join(' '));
    } else if (i === 'css') {
      for (let c in accent[i]) {
        domCssPropertySet(c, accent[i][c]);
      }
    }
  }
}

/**
 * 设置全局class
 * @param value 属性值
 */
export function domClassPropertySet(value: string) {
  document.body.className = document.body.className + ' ' + value;
}

/**
 * 设置全局css
 * @param key 属性名
 * @param value 属性值
 */
export function domCssPropertySet(key: string, value: any) {
  document.body.style.setProperty(key, value);
}

/**
 * 创建元素
 * @param key
 * @param css
 */
export function domCreateElement<K extends keyof HTMLElementTagNameMap>(key: K, css?: string) {
  const dom = document.createElement(key);
  if (css) dom.setAttribute('class', css);
  return dom;
}

/**
 * 双向绑定
 */
export function domObserver<T>(
  value: T,
  callback?: (target: T, p: string, value: any) => void
): Partial<{ value: T } & T> {
  const isObject = typeof value === 'object';
  const handler: ProxyHandler<any> = {
    get: (target, p) => {
      return target[p];
    },
    set: (target, p, value) => {
      if (target[p] !== value) {
        target[p] = value;
        callback(target, p as string, value);
      }
      return true;
    }
  };
  return isObject ? new Proxy(value, handler) : new Proxy({ value }, handler);
}

/**
 * dom
 */
class Dom {
  private static instance: Dom;

  public appDom: HTMLElement = null;
  public mainDom: HTMLElement = null;
  public components: { [key: string]: Component } = {};

  static getInstance() {
    if (!Dom.instance) Dom.instance = new Dom();
    return Dom.instance;
  }

  /**
   * 初始dom
   */
  init(app: string, main: string) {
    this.appDom = document.getElementById(app);
    this.mainDom = document.getElementById(main);
  }

  setComponent(c: Component) {
    if (c.global) {
      if (!c.force && !isNull(this.components[c.name])) return;
      if (this.components[c.name]) this.appDom.removeChild(this.components[c.name].dom);
      this.components[c.name] = c;
      this.appDom.appendChild(c.dom);
    } else this.mainDom.appendChild(c.dom);
  }

  renderRouter(view: View) {
    while (this.mainDom.hasChildNodes()) {
      this.mainDom.removeChild(this.mainDom.firstChild);
    }
    if (view.components)
      for (let i = 0, len = view.components.length; i < len; i++) {
        this.setComponent(view.components[i]);
      }
    for (let i = 0, len = view.dom.length; i < len; i++) {
      this.mainDom.appendChild(view.dom[i]);
    }
  }
}

export default Dom.getInstance();
