import { windowClose, windowMaxMin, windowMin } from '@/renderer/common/window';
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
    const title = <div class="title">{window.customize.title}</div>;
    if (window.environment.platform === 'darwin') {
      content.appendChild(<div></div>);
      content.appendChild(title);
    } else {
      content.appendChild(title);
      if (this.isHead) content.appendChild(this.events());
    }
    return <div class={style + ' drag'}>{content}</div>;
  }
}
