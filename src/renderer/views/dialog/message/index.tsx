import { h } from '@/renderer/common/h';
import { getCustomize } from '@/renderer/store';
import { windowMessageSend, windowShow } from '@/renderer/common/window';
import indexCss from './scss/index.lazy.scss';

const args = getCustomize();

export default class Message implements View {
  styles = [indexCss];

  onReady() {
    windowShow();
  }

  render() {
    return (
      <div class="info">
        <div class="text">
          <div>创建传参: {JSON.stringify(args.data as any)}</div>
          <div>app启动参数: {JSON.stringify(args.argv as any)}</div>
        </div>
        <button class="text" onClick={() => windowMessageSend('test', Date.now())}>
          发送消息
        </button>
      </div>
    );
  }
}
