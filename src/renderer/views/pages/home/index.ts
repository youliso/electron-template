import Store from '@/renderer/store';
import Router from '@/renderer/router';
import { windowCreate, windowMessageOn, windowShow } from '@/renderer/utils/window';
import { domCreateElement } from '@/renderer/utils/dom';
import { openUrl } from '@/renderer/utils';
import { dateFormat } from '@/lib';
import styles from './scss/index.lazy.scss';

const args = Store.get<Customize>('customize');
let listData: StoreProxy<string[]>;
let testData: StoreProxy<{ time: string; a: string }>;

function testRender() {
  const test = domCreateElement('div', 'text');
  // listData = Store.proxy([], (value, p: string) => {
  //   console.log(listData.proxy, p);
  // });
  testData = Store.proxy({ time: dateFormat(), a: '1' }, (value, p: string) => {
    if (p === 'time') test.innerText = value;
  });
  test.innerText = dateFormat();
  const ls = setInterval(() => {
    try {
      testData.proxy.a = Date.now() + '';
      testData.proxy.time = dateFormat();
    } catch (e) {
      clearInterval(ls);
    }
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
  if (listData) listData.revoke();
  if (testData) testData.revoke();
}

export default function (): View {
  const vue = domCreateElement('div', 'btn', 'vue 模板');
  const svelte = domCreateElement('div', 'btn', 'svelte 模板');
  const react = domCreateElement('div', 'btn', 'react 模板');
  const but = domCreateElement('button', 'but', '弹框');
  const about = domCreateElement('button', 'but', '关于');
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
    Router.replace('/about');
  });
  return {
    dom: [vue, svelte, react, testRender(), but, about]
  };
}
