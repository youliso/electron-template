import { getCustomize } from '@/renderer/store';
import { domCreateElement, View } from '@/renderer/common/dom';
import { windowClose, windowMessageSend, windowShow } from '@/renderer/common/window';
import indexCss from './scss/index.lazy.scss';
import Head from '@/renderer/views/components/head';

const args = getCustomize();

export default class Message extends View {
  styles = [indexCss];
  components = {
    Head: new Head(false)
  };

  onLoad() {}

  onReady() {
    windowShow();
  }

  onUnmounted() {}

  render() {
    const el = domCreateElement('div', 'info');
    const text = domCreateElement('div', 'text');
    const text1 = domCreateElement('div', null, `创建传参: ${JSON.stringify(args.data)}`);
    const text2 = domCreateElement('div', null, `app启动参数: ${JSON.stringify(args.argv)}`);
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
