import Store from '@/renderer/store';
import Router from '@/renderer/router';
import Head from '@/renderer/views/components/head';
import { domCreateElement } from '@/renderer/utils/dom';
import './scss/index.scss';

export default function () {
  const appDom = document.getElementById(Store.get<string>('appDom'));
  const container = domCreateElement('div', 'container padding');
  const text = domCreateElement('div', 'text');
  const home = domCreateElement('button', 'but');
  text.innerText = '关于';
  home.innerText = '首页';
  home.addEventListener('click', () => {
    Router.go(-1);
  });
  container.appendChild(text);
  container.appendChild(home);
  appDom.appendChild(Head());
  appDom.appendChild(container);
}
