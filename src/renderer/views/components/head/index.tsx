import { headStore } from '@/renderer/store';
import style from './style';

export default class Head {
  render() {
    const content = <div class="content"></div>;
    const titleEl = <div class="title">{headStore.getState().title}</div>;
    headStore.subscribe(({ title, show }) => {
      title && (titleEl.textContent = title);
      (content as HTMLElement).style.display = show ? '' : 'none';
    });
    if (window.environment.platform === 'darwin') {
      content.appendChild(<div></div>);
      content.appendChild(titleEl);
    } else {
      content.appendChild(titleEl);
    }
    return <div class={style + ' drag'}>{content}</div>;
  }
}
