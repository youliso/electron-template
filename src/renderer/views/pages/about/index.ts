import Router from '@/renderer/router';
import { domCreateElement } from '@/renderer/utils/dom';
import './scss/index.scss';
import Head from '@/renderer/views/components/head';

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
