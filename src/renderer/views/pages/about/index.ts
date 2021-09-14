import Router from '@/renderer/router';
import { domCreateElement } from '@/renderer/common/dom';
import styles from './scss/index.lazy.scss';
import Head from '@/renderer/views/components/head';

export default class About implements View {
  static instance = true;
  el: HTMLDivElement;
  components = [new Head()];
  countDom: HTMLButtonElement;
  count: number = 0;

  onLoad(params?: RouteParams) {
    styles.use();
  }

  onActivated() {
    styles.use();
  }

  onDeactivated() {
    styles.unuse();
  }

  onReady() {}

  onUnmounted() {
    styles.unuse();
  }

  countAdd() {
    this.count++;
    this.countDom.textContent = `${this.count} add`;
  }

  render() {
    this.el = domCreateElement('div', 'info');
    const text = domCreateElement('div', 'text', '关于');
    const home = domCreateElement('button', 'but', '首页');
    this.countDom = domCreateElement('button', 'but', `${this.count} add`);
    home.addEventListener('click', () => Router.replace('/home', { unInstance: false }));
    this.countDom.addEventListener('click', () => this.countAdd());
    this.el.appendChild(text);
    this.el.appendChild(home);
    this.el.appendChild(this.countDom);
  }
}
