import Store from '@/renderer/store';
import { domCreateElement } from '@/renderer/utils/dom';
import { getGlobal } from '@/renderer/utils';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/utils/window';
import './scss/index.scss';

const info = domCreateElement('div', 'head-info drag');
const content = domCreateElement('div', 'content');

function events(is: boolean, args: Customize) {
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
  if (is) content.appendChild(events);
  Store.proxy<boolean>('head-events', is, (value) => {
    if (value) content.appendChild(events);
    else content.removeChild(events);
  });
}

export default function (): Component {
  const args = Store.get<Customize>('customize');
  const title = domCreateElement('div', 'title');
  title.innerText = args.title || getGlobal('app.name');
  if (getGlobal('system.platform') === 'darwin') {
    content.appendChild(document.createElement('div'));
    content.appendChild(title);
  } else {
    content.appendChild(title);
    events(true, args);
  }
  info.appendChild(content);
  return {
    name: 'Head',
    global: true,
    dom: info
  };
}
