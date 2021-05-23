import { getGlobal } from './';

/**
 * 页面初始化加载
 * @param key
 * @param value
 */
export function domPropertyLoad() {
  let accent = getGlobal('app.dom');
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
