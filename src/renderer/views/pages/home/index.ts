import Store from '@/renderer/store';
import Router from '@/renderer/router';
import { windowCreate, windowMessageOn, windowShow } from '@/renderer/common/window';
import { domCreateElement } from '@/renderer/common/dom';
import { dateFormat } from '@/lib';
import { shortcutGetAll } from '@/renderer/common/shortcut';
import Head from '@/renderer/views/components/head';
import styles from './scss/index.lazy.scss';

const args = Store.get<Customize>('customize');

export default class Home implements View {
  private testData: StoreProxy<string>;
  private testInterval: NodeJS.Timer;
  components = {
    Head: new Head()
  };

  onLoad() {
    styles.use();
    this.onTest();
  }

  onReady() {
    windowShow(args.id);
  }

  onUnmounted() {
    styles.unuse();
    if (this.testData) this.testData.revoke();
    if (this.testInterval) clearInterval(this.testInterval);
  }

  onTest() {
    windowMessageOn('test', (event, args) => {
      console.log(args);
    });
  }

  testRender() {
    const test = domCreateElement('div', 'text');
    this.testData = Store.proxy(dateFormat(), (value) => (test.textContent = value));
    test.textContent = dateFormat();
    this.testInterval = setInterval(() => {
      this.testData.proxy.value = dateFormat();
    }, 1000);
    return test;
  }

  render() {
    const el = domCreateElement('div', 'info');
    const baidu = domCreateElement('button', 'but', '打开baidu');
    const but = domCreateElement('button', 'but', '弹框');
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
    el.appendChild(this.testRender());
    el.appendChild(but);
    el.appendChild(about);
    el.appendChild(shortcut);
    el.appendChild(baidu);
    return el;
  }
}
