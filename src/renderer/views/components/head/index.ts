import './scss/index.scss';
import { getGlobal } from '@/renderer/utils';
import Store from '@/renderer/store';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/utils/window';

const dom = document;
export default function() {
  const info = dom.createElement('div');
  const content = dom.createElement('div');
  const title = dom.createElement('div');
  info.setAttribute('class', 'head-info drag');
  content.setAttribute('class', 'content');
  title.setAttribute('class', 'title');
  title.innerText = Store.sharedObject['window'].title || getGlobal('app.name');
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
    min.addEventListener('click', () => windowMin(Store.sharedObject['window'].id));
    maxMin.setAttribute('class', 'event max-min no-drag');
    maxMin.addEventListener('click', () => windowMaxMin(Store.sharedObject['window'].id));
    close.setAttribute('class', 'event close no-drag');
    close.addEventListener('click', () => windowClose(Store.sharedObject['window'].id));
    events.setAttribute('class', 'events');
    events.appendChild(min);
    events.appendChild(maxMin);
    events.appendChild(close);
    content.appendChild(events);
  }
  info.appendChild(content);
  return info;
}