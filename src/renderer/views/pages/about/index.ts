import Router from '@/renderer/router';
import { domCreateElement } from '@/renderer/utils/dom';
import styles from '@/renderer/views/dialog/message/scss/index.lazy.scss';

export function onLoad() {
  styles.use();
}

export function onReady() {
  console.log('onReady');
}

export function onUnmounted() {
  styles.unuse();
}

export default function (params?: RouteParams): View {
  const text = domCreateElement('div', 'text');
  const home = domCreateElement('button', 'but');
  text.innerText = '关于';
  home.innerText = '首页';
  home.addEventListener('click', () => {
    Router.go('/home');
  });
  return {
    dom: [text, home]
  };
}
