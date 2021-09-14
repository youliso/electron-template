import Store from '@/renderer/store';
import { domCreateElement } from '@/renderer/common/dom';
import { getGlobal } from '@/renderer/common';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/common/window';
import styles from './scss/index.lazy.scss';

const args = Store.get<Customize>('customize');

export default class Head implements Component {
  name = 'Head';
  el: HTMLDivElement;
  isHead: boolean;

  constructor(isHead: boolean = true) {
    this.isHead = isHead;
  }

  onLoad(params?: RouteParams) {
    styles.use();
  }

  onUnmounted() {
    styles.unuse();
    Store.removeProxy('head-events');
  }

  events(content: HTMLDivElement) {
    const events = domCreateElement('div', 'events');
    const min = domCreateElement('div', 'event min no-drag');
    const maxMin = domCreateElement('div', 'event max-min no-drag');
    const close = domCreateElement('div', 'event close no-drag');
    min.addEventListener('click', () => windowMin(args.id));
    maxMin.addEventListener('click', () => windowMaxMin(args.id));
    close.addEventListener('click', () => windowClose(args.id));
    events.appendChild(min);
    events.appendChild(maxMin);
    events.appendChild(close);
    if (this.isHead) content.appendChild(events);
  }

  render() {
    this.el = domCreateElement('div', 'head-info drag');
    const content = domCreateElement('div', 'content');
    const title = domCreateElement('div', 'title', args.title || getGlobal<string>('app.name'));
    if (getGlobal('system.platform') === 'darwin') {
      content.appendChild(document.createElement('div'));
      content.appendChild(title);
    } else {
      content.appendChild(title);
      this.events(content);
    }
    this.el.appendChild(content);
  }
}
