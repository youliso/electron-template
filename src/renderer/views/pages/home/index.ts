import Store from '@/renderer/store';
import Router from '@/renderer/router';
import Head from '@/renderer/views/components/head';
import { windowShow, windowCreate } from '@/renderer/utils/window';
import { domCreateElement } from '@/renderer/utils/dom';
import { openUrl } from '@/renderer/utils';
import './scss/index.scss';

export default function () {
  const appDom = document.getElementById(Store.get<string>('appDom'));
  const args = Store.get<Customize>('customize');
  const container = domCreateElement('div', 'container padding');
  const vue = domCreateElement('div', 'btn');
  const svelte = domCreateElement('div', 'btn');
  const but = domCreateElement('button', 'but');
  const about = domCreateElement('button', 'but');
  vue.innerText = 'vue 模板';
  svelte.innerText = 'svelte 模板';
  but.innerText = '弹框';
  about.innerText = '关于';
  vue.addEventListener('click', () => {
    openUrl('https://github.com/youliso/electron-template/tree/vue');
  });
  svelte.addEventListener('click', () => {
    openUrl('https://github.com/youliso/electron-template/tree/svelte');
  });
  but.addEventListener('click', () => {
    windowCreate({
      customize: {
        title: '弹框测试',
        route: '/message',
        parentId: args.id,
        data: { text: '123' }
      },
      width: 400,
      height: 200,
      modal: true,
      resizable: true
    });
  });
  about.addEventListener('click', () => {
    Router.go('/about');
  });
  container.appendChild(vue);
  container.appendChild(svelte);
  container.appendChild(but);
  container.appendChild(about);
  appDom.appendChild(Head());
  appDom.appendChild(container);
  windowShow(args.id);
}
