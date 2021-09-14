import { getGlobal } from './';

/**
 * 组件
 */
export class Component implements VSource {
  $currentName: string;
  $name: string;
  $el: HTMLElement;
}

/**
 * 页面
 */
export class View implements VSource {
  $instance: boolean;
  $name: string;
  $el: HTMLElement;
}

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
 * @param html （可选）
 */
export function domCreateElement<K extends keyof HTMLElementTagNameMap>(
  el: K,
  css?: string | string[],
  text?: string,
  html?: string
) {
  const dom = document.createElement(el);
  if (css) {
    if (typeof css === 'string') dom.setAttribute('class', css);
    else dom.setAttribute('class', css.join(' '));
  }
  if (text) dom.textContent = text;
  if (html) dom.innerHTML = html;
  return dom;
}
