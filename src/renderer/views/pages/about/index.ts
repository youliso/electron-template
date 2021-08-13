import Router from '@/renderer/router';
import { domCreateElement } from '@/renderer/utils/dom';
import './scss/index.scss';

export function onReady() {
  console.log('about');
}

export function onUnmounted() {
  console.log('unmounted');
}

export default function (): View {
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
