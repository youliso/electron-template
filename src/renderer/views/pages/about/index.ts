import Router from '@/renderer/router';
import { domCreateElement } from '@/renderer/utils/dom';
import styles from '@/renderer/views/dialog/message/scss/index.lazy.scss';

export function onLoad() {
  styles.use();
}

export function onUnmounted() {
  styles.unuse();
}

export default function (params?: RouteParams): View {
  const text = domCreateElement('div', 'text');
  const home = domCreateElement('button', 'but');
  const test = domCreateElement('button', 'but');
  text.innerText = '关于';
  home.innerText = '首页';
  test.innerText = '首页';
  home.addEventListener('click', () => Router.go('/home'));
  test.addEventListener('click', () => Router.back(1));
  return {
    dom: [text, home, test]
  };
}
