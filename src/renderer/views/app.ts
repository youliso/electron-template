import customize from '@/renderer/store/customize';
import Head from '@/renderer/views/components/head';
import { windowShow } from '@/renderer/utils/window';
import { domCreateElement } from '@/renderer/utils/dom';
import { openUrl } from '@/renderer/utils';
import '@/renderer/views/scss/app.scss';

export default function (el: string) {
  const args = customize.get();
  const appDom = document.getElementById(el);
  const container = domCreateElement('div', 'container padding');
  const vue = domCreateElement('div', 'btn');
  const svelte = domCreateElement('div', 'btn');
  vue.innerText = 'vue 模板';
  svelte.innerText = 'svelte 模板';
  vue.addEventListener('click', () => {
    openUrl('https://github.com/youliso/electron-template/tree/vue');
  });
  svelte.addEventListener('click', () => {
    openUrl('https://github.com/youliso/electron-template/tree/svelte');
  });
  container.appendChild(vue);
  container.appendChild(svelte);
  appDom.appendChild(Head());
  appDom.appendChild(container);
  windowShow(args.id);
}
