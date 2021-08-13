import Store from '@/renderer/store';
import Router from '@/renderer/router';
import { windowCreate, windowShow } from '@/renderer/utils/window';
import { domCreateElement, domObserver } from '@/renderer/utils/dom';
import { openUrl } from '@/renderer/utils';
import './scss/index.scss';
import { dateFormat } from '@/lib';

const args = Store.get<Customize>('customize');

function testRender() {
  const test = domCreateElement('div', 'text');
  const testData = domObserver<{ time: string; a: string }>(
    { time: dateFormat(), a: '1' },
    (target, p, value) => {
      if (p === 'time') test.innerText = value;
    }
  );
  test.innerText = dateFormat();
  setInterval(() => {
    testData.time = dateFormat();
    setTimeout(() => {
      testData.a = Date.now() + '';
    }, 40);
  }, 1000);

  return test;
}

export function onReady() {
  windowShow(args.id);
}

export function onUnmounted() {
  console.log(123);
}

export default function (): View {
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
  return {
    dom: [vue, svelte, testRender(), but, about]
  };
}
