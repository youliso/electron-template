import Store from '@/renderer/store';
import { domCreateElement } from '@/renderer/utils/dom';
import { getGlobal } from '@/renderer/utils';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/utils/window';
import './scss/index.scss';

export default function (eventsShow: boolean = true) {
  const args = Store.get<Customize>('customize');
  const info = domCreateElement('div', 'head-info drag');
  const content = domCreateElement('div', 'content');
  const title = domCreateElement('div', 'title');
  title.innerText = args.title || getGlobal('app.name');
  if (getGlobal('system.platform') === 'darwin') {
    content.appendChild(document.createElement('div'));
    content.appendChild(title);
  } else {
    content.appendChild(title);
    if (eventsShow) {
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
      content.appendChild(events);
    }
  }
  info.appendChild(content);
  return info;
}
