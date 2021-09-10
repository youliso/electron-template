import Router from '@/renderer/router';
import { domCreateElement } from '@/renderer/common/dom';
import styles from './scss/index.lazy.scss';

export function onLoad() {
  styles.use();
}

export function onUnmounted() {
  styles.unuse();
}

export default function (params?: RouteParams): View {
  const text = domCreateElement('div', 'text', '关于');
  const home = domCreateElement('button', 'but', '首页');
  home.addEventListener('click', () => Router.replace('/home'));
  return {
    dom: [text, home]
  };
}
