import Store from '@/renderer/store';
import { domCreateElement, Component } from '@/renderer/common/dom';
import { getGlobal } from '@/renderer/common';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/common/window';
import indexCss from './scss/index.lazy.scss';

const args = Store.get<Customize>('customize');

export default class Head extends Component {
  styles = [indexCss];
  isHead: boolean;

  constructor(isHead: boolean = true) {
    super();
    this.isHead = isHead;
  }

  onLoad(params?: RouteParams) {}

  onReady() {}

  onUnmounted() {}

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
    const el = domCreateElement('div', 'head-info drag');
    const content = domCreateElement('div', 'content');
    const title = domCreateElement('div', 'title', args.title || getGlobal<string>('app.name'));
    if (getGlobal('system.platform') === 'darwin') {
      content.appendChild(document.createElement('div'));
      content.appendChild(title);
    } else {
      content.appendChild(title);
      this.events(content);
    }
    el.appendChild(content);
    return el;
  }
}
