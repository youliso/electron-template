import { windowMessageSend, windowShow } from '@youliso/electron-modules/renderer/window';
import style from './style';

export default class Message {
  onReady() {
    windowShow();
  }

  render() {
    return (
      <div class={style}>
        <div class="list">
          <div class="text">
            <div class="name">窗口参数</div>
            <div class="value">{JSON.stringify(window.customize.data as any)}</div>
          </div>
          <div class="text">
            <div class="name">进程参数</div>
            <div class="value">{JSON.stringify(window.customize.argv as any)}</div>
          </div>
        </div>
        <div class="buts">
          <button onClick={() => windowMessageSend(Date.now())}>发送消息</button>
        </div>
      </div>
    );
  }
}
