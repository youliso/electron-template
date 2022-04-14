import { windowClose, windowMaxMin, windowMin } from '@/renderer/common/window';
import { titleStore } from '@/renderer/store';
import style from './style';

export default class Head {
  isHead: boolean;

  constructor(isHead: boolean = true) {
    this.isHead = isHead;
  }

  events() {
    return (
      <div class="events">
        <div class="event min no-drag" onClick={() => windowMin()}></div>
        <div class="event max-min no-drag" onClick={() => windowMaxMin()}></div>
        <div class="event close no-drag" onClick={() => windowClose()}></div>
      </div>
    );
  }

  render() {
    const content = <div class="content"></div>;
    const titleEl = <div class="title">{titleStore.getState().title}</div>;
    titleStore.subscribe(({ title }) => title && (titleEl.textContent = title));
    if (window.environment.platform === 'darwin') {
      content.appendChild(<div></div>);
      content.appendChild(titleEl);
    } else {
      content.appendChild(titleEl);
      if (this.isHead) content.appendChild(this.events());
    }
    return <div class={style + ' drag'}>{content}</div>;
  }
}
