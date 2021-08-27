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
  const text = domCreateElement('div', 'text', '关于');
  const home = domCreateElement('button', 'but', '首页');
  home.addEventListener('click', () => Router.replace('/home'));
  return {
    dom: [text, home]
  };
}
