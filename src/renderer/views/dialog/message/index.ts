import Store from '@/renderer/store';
import { domCreateElement } from '@/renderer/common/dom';
import { getGlobal } from '@/renderer/common';
import { windowClose, windowMessageSend, windowShow } from '@/renderer/common/window';
import styles from './scss/index.lazy.scss';
import Head from '@/renderer/views/components/head';

const args = Store.get<Customize>('customize');

export default class Message implements View {
  components = {
    Head: new Head(false)
  };

  onLoad() {
    styles.use();
  }

  onReady() {
    windowShow(args.id);
  }

  onUnmounted() {
    styles.unuse();
  }

  render() {
    const el = domCreateElement('div', 'info');
    const text = domCreateElement('div', 'text');
    const text1 = domCreateElement('div', null, `创建传参: ${JSON.stringify(args.data)}`);
    const text2 = domCreateElement('div', null, `app启动参数: ${getGlobal('app.argv')}`);
    const send = domCreateElement('button', 'test', '发送消息');
    const but = domCreateElement('button', 'close', '确定');
    but.addEventListener('click', () => windowClose(args.id));
    send.addEventListener('click', () => windowMessageSend('test', Date.now()));
    text.appendChild(text1);
    text.appendChild(text2);
    el.appendChild(send);
    el.appendChild(text);
    el.appendChild(but);
    return el;
  }
}
