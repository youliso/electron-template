import { getCustomize, testProxy, testProxyRemove } from '@/renderer/store';
import Router from '@/renderer/router';
import {
  windowCreate,
  windowMessageOn,
  windowMessageRemove,
  windowShow
} from '@/renderer/common/window';
import { domCreateElement, View } from '@/renderer/common/dom';
import { dateFormat } from '@/utils';
import { shortcutGetAll } from '@/renderer/common/shortcut';
import indexCss from './scss/index.lazy.scss';

const args = getCustomize();

export default class Home extends View {
  private testData: ProxyValue<string> | undefined;
  private testInterval: NodeJS.Timer | undefined;
  styles = [indexCss];

  onLoad() {
    this.onTest();
  }

  onReady() {
    windowShow();
  }

  onUnmounted() {
    if (this.testData) testProxyRemove();
    if (this.testInterval) clearInterval(this.testInterval);
    this.unTest();
  }

  onTest() {
    windowMessageOn('test', (event, args) => {
      console.log(args);
    });
  }

  unTest() {
    windowMessageRemove('test');
  }

  testRender() {
    const test = domCreateElement('div', 'text');
    this.testData = testProxy(dateFormat(), test);
    test.textContent = dateFormat();
    this.testInterval = setInterval(() => {
      if (this.testData) this.testData.value = dateFormat();
    }, 1000);
    return test;
  }

  render() {
    const el = domCreateElement('div', 'info');
    const baidu = domCreateElement('button', 'but', '打开baidu');
    const but = domCreateElement('button', 'but', '弹框');
    const shortcut = domCreateElement('button', 'but', '获取已注册shortcut');
    const about = domCreateElement('button', 'but', '关于');
    const music = domCreateElement('button', 'but', 'music');
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
      shortcutGetAll().then(console.log);
    });
    about.addEventListener('click', () => {
      Router.push('/about');
    });
    music.addEventListener('click', async () => {
      console.log('123');
      await Router.push('/music');
      console.log('321');
    });
    el.appendChild(this.testRender());
    el.appendChild(but);
    el.appendChild(about);
    el.appendChild(music);
    el.appendChild(shortcut);
    el.appendChild(baidu);
    return el;
  }
}
