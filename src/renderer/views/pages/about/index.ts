import Router from '@/renderer/router';
import { View, domCreateElement } from '@/renderer/common/dom';
import indexCss from './scss/index.lazy.scss';

export default class About extends View {
  styles = [indexCss];

  countDom: HTMLButtonElement;
  count: number = 0;

  onLoad() {}

  onActivated() {}

  onDeactivated() {}

  onReady() {}

  onUnmounted() {}

  countAdd() {
    this.count++;
    this.countDom.textContent = `${this.count} add`;
  }

  render() {
    const el = domCreateElement('div', 'info');
    const text = domCreateElement('div', 'text', '关于');
    const home = domCreateElement('button', 'but', '首页');
    this.countDom = domCreateElement('button', 'but', `${this.count} add`);
    home.addEventListener('click', () => Router.back());
    this.countDom.addEventListener('click', () => this.countAdd());
    el.appendChild(text);
    el.appendChild(home);
    el.appendChild(this.countDom);
    return el;
  }
}
