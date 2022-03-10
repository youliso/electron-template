import { getCustomize } from '@/renderer/store';
import { windowMessageSend, windowShow } from '@/renderer/common/window';
import style from './style';

const args = getCustomize();

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
            <div class="value">{JSON.stringify(args.data as any)}</div>
          </div>
          <div class="text">
            <div class="name">进程参数</div>
            <div class="value">{JSON.stringify(args.argv as any)}</div>
          </div>
        </div>
        <div class="buts">
          <button onClick={() => windowMessageSend('test', Date.now())}>发送消息</button>
        </div>
      </div>
    );
  }
}
