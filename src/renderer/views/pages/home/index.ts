import Store from '@/renderer/store';
import Router from '@/renderer/router';
import { windowCreate } from '@/renderer/utils/window';
import { domCreateElement } from '@/renderer/utils/dom';
import { openUrl } from '@/renderer/utils';
import './scss/index.scss';

export default function (): View {
  const args = Store.get<Customize>('customize');
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
        data: { text: '123', head: { eventsShow: false } }
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
  return {
    dom: [vue, svelte, but, about]
  };
}
