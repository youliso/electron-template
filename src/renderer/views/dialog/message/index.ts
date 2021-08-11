import Store from '@/renderer/store';
import Head from '@/renderer/views/components/head';
import { domCreateElement } from '@/renderer/utils/dom';
import { getGlobal } from '@/renderer/utils';
import { windowClose, windowMaxMin, windowMin, windowShow } from '@/renderer/utils/window';
import './scss/index.scss';

export default function () {
  const appDom = document.getElementById(Store.get<string>('appDom'));
  const args = Store.get<Customize>('customize');
  const container = domCreateElement('div', 'container padding');
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
  container.appendChild(info);
  appDom.appendChild(Head());
  appDom.appendChild(container);
  windowShow(args.id);
}
