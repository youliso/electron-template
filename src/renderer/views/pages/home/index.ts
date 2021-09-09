import Store from '@/renderer/store';
import Router from '@/renderer/router';
import { windowCreate, windowMessageOn, windowShow } from '@/renderer/common/window';
import { domCreateElement } from '@/renderer/common/dom';
import { dateFormat } from '@/lib';
import styles from './scss/index.lazy.scss';
import { shortcutGetAll } from '@/renderer/common/shortcut';

const args = Store.get<Customize>('customize');
// let listData: StoreProxy<string[]>;
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
      // listData.proxy.push(Date.now() + '');
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
  // if (listData) listData.revoke();
  if (testData) testData.revoke();
}

export default function (): View {
  const baidu = domCreateElement('button', 'but', '打开baidu');
  const but = domCreateElement('button', 'but', '弹框');
  const demo = domCreateElement('button', 'but', 'demo');
  const shortcut = domCreateElement('button', 'but', '获取已注册shortcut');
  const about = domCreateElement('button', 'but', '关于');
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
  demo.addEventListener('click', () => {
    windowCreate({
      customize: {
        title: 'demo',
        route: '/demo',
        parentId: args.id
      },
      width: 800,
      height: 600,
      resizable: true
    });
  });
  baidu.addEventListener('click', () => {
    windowCreate({
      customize: {
        url: 'https://baidu.com/',
        parentId: args.id
      },
      width: 800,
      height: 600,
      resizable: true
    });
  });
  shortcut.addEventListener('click', () => {
    console.log(shortcutGetAll());
  });
  about.addEventListener('click', () => {
    Router.replace('/about');
  });
  return {
    dom: [testRender(), but, demo, about, shortcut, baidu]
  };
}
