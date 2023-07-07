import { windowShow } from '@youliso/electronic/ipc/window';
import style from './style';

export const onReady = () => {
  windowShow();
};

export const render = () => {
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
    </div>
  );
};
