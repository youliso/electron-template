/**
 * 组件
 */
export class Component implements VSource {
  $currentName: string | undefined;
  $name: string | undefined;
  $el: HTMLElement | undefined;
  styles: any[] = [];

  onLoad() {}

  onReady() {}

  onUnmounted() {}

  onActivated() {}

  onDeactivated() {}
}

/**
 * 页面
 */
export class View implements VSource {
  $instance: boolean | undefined;
  $name: string | undefined;
  $el: HTMLElement | undefined;
  styles: any[] = [];
  components = {};

  onLoad() {}

  onReady() {}

  onUnmounted() {}

  onActivated() {}

  onDeactivated() {}
}

/**
 * 页面初始化加载
 */
export function domPropertyLoad() {
  document.body.setAttribute('platform', window.environment.platform);
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
  css?: string | string[] | null,
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
