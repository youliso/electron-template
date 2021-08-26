import Store from '@/renderer/store';
import Router from '@/renderer/router';
import { windowCreate, windowMessageOn, windowShow } from '@/renderer/utils/window';
import { domCreateElement } from '@/renderer/utils/dom';
import { openUrl } from '@/renderer/utils';
import { dateFormat } from '@/lib';
import styles from './scss/index.lazy.scss';

const args = Store.get<Customize>('customize');

function testRender() {
  const test = domCreateElement('div', 'text');
  let list: string[] = [];
  const listData = Store.proxy(list, (value, p: string) => {
    console.log(listData, p);
  });
  const testData = Store.proxy({ time: dateFormat(), a: '1' }, (value, p: string) => {
    if (p === 'time') test.innerText = value;
  });
  test.innerText = dateFormat();
  setInterval(() => {
    listData.push(Date.now() + '');
    testData.a = Date.now() + '';
    testData.time = dateFormat();
  }, 1000);

  return test;
}

function onTest() {
  windowMessageOn('test', (event, args) => {
    console.log(args);
  });
}

export function onLoad() {
  styles.use();
  onTest();
}

export function onReady() {
  windowShow(args.id);
}

export function onUnmounted() {
  styles.unuse();
}

export default function (): View {
  const vue = domCreateElement('div', 'btn');
  const svelte = domCreateElement('div', 'btn');
  const react = domCreateElement('div', 'btn');
  const but = domCreateElement('button', 'but');
  const about = domCreateElement('button', 'but');
  vue.innerText = 'vue 模板';
  svelte.innerText = 'svelte 模板';
  react.innerText = 'react 模板';
  but.innerText = '弹框';
  about.innerText = '关于';
  vue.addEventListener('click', () => {
    openUrl('https://github.com/youliso/electron-template/tree/vue');
  });
  svelte.addEventListener('click', () => {
    openUrl('https://github.com/youliso/electron-template/tree/svelte');
  });
  react.addEventListener('click', () => {
    openUrl('https://github.com/youliso/electron-template/tree/react');
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
    dom: [vue, svelte, react, testRender(), but, about]
  };
}
