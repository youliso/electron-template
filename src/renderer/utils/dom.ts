import { getGlobal } from './';
import { isNull } from '@/lib';

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
 * @param el 元素
 * @param css class名称（可选）
 * @param text 文本（可选）
 */
export function domCreateElement<K extends keyof HTMLElementTagNameMap>(
  el: K,
  css?: string,
  text?: string
) {
  const dom = document.createElement(el);
  if (css) dom.setAttribute('class', css);
  if (text) dom.innerText = text;
  return dom;
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
      if (this.components[c.name]) {
        this.appDom.removeChild(this.components[c.name].dom);
        delete this.components[c.name];
      }
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
