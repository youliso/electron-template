import './scss/index.scss';
import { getGlobal } from '@/renderer/utils';
import customize from '@/renderer/store/customize';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/utils/window';

const dom = document;
export default function () {
  const args = customize.get();
  const info = dom.createElement('div');
  const content = dom.createElement('div');
  const title = dom.createElement('div');
  info.setAttribute('class', 'head-info drag');
  content.setAttribute('class', 'content');
  title.setAttribute('class', 'title');
  title.innerText = args.title || getGlobal('app.name');
  if (getGlobal('system.platform') === 'darwin') {
    content.appendChild(dom.createElement('div'));
    content.appendChild(title);
  } else {
    content.appendChild(title);
    const events = dom.createElement('div');
    const min = dom.createElement('div');
    const maxMin = dom.createElement('div');
    const close = dom.createElement('div');
    min.setAttribute('class', 'event min no-drag');
    min.addEventListener('click', () => windowMin(args.id));
    maxMin.setAttribute('class', 'event max-min no-drag');
    maxMin.addEventListener('click', () => windowMaxMin(args.id));
    close.setAttribute('class', 'event close no-drag');
    close.addEventListener('click', () => windowClose(args.id));
    events.setAttribute('class', 'events');
    events.appendChild(min);
    events.appendChild(maxMin);
    events.appendChild(close);
    content.appendChild(events);
  }
  info.appendChild(content);
  return info;
}
