import Store from '@/renderer/store';
import Head from '@/renderer/views/components/head';
import { windowShow } from '@/renderer/utils/window';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

const dom = document;
const appDom = dom.getElementById('app');

export default function() {
  appDom.appendChild(Head());
  const container = dom.createElement('div');
  container.setAttribute('class', 'container padding');
  container.innerText = `hello world ${JSON.stringify(Store.sharedObject)}`;
  appDom.appendChild(container);
  windowShow(Store.sharedObject['window'].id);
}