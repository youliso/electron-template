import Store from '@/renderer/store';
import { domCreateElement } from '@/renderer/utils/dom';
import { getGlobal } from '@/renderer/utils';
import { windowClose, windowShow } from '@/renderer/utils/window';
import styles from './scss/index.lazy.scss';

const args = Store.get<Customize>('customize');

function onLoad() {
  styles.use();
}

export function onReady() {
  windowShow(args.id);
}

export function onUnmounted() {
  styles.unuse();
}

export default function (): View {
  const info = domCreateElement('div', 'message-info');
  const text = domCreateElement('div', 'text');
  const text1 = domCreateElement('div');
  const text2 = domCreateElement('div');
  const but = domCreateElement('button', 'close');
  text1.innerText = `创建传参: ${JSON.stringify(args.data)}`;
  text2.innerText = `app启动参数: ${getGlobal('app.argv')}`;
  but.innerText = '确定';
  but.addEventListener('click', () => windowClose(args.id));
  text.appendChild(text1);
  text.appendChild(text2);
  info.appendChild(text);
  info.appendChild(but);

  return {
    dom: [info]
  };
}
