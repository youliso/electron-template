import customize from '@/renderer/store/customize';
import Head from '@/renderer/views/components/head';
import { windowShow } from '@/renderer/utils/window';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

const dom = document;
const appDom = dom.getElementById('app');

export default function () {
  const args = customize.get();
  const container = dom.createElement('div');
  container.setAttribute('class', 'container padding');
  container.innerText = `hello world ${JSON.stringify(args)}`;
  appDom.appendChild(Head());
  appDom.appendChild(container);
  windowShow(args.id);
}
