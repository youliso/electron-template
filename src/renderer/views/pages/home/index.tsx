import { useElement } from '@youliso/granule';
import Router from '@/renderer/router';
import { windowCreate, windowShow } from '@youliso/electronic/renderer/window';
import { shortcutGetAll } from '@youliso/electronic/renderer/shortcut';
import style from './style';

let testInterval: NodeJS.Timer | undefined;

export const onUnmounted = () => {
  if (testInterval) clearInterval(testInterval);
};

export const onReady = () => {
  windowShow();
};

export const beforeRoute = (to: string, from: string, next: () => void) => {
  console.log(to, from);
  next();
};

const tk = () => {
  windowCreate(
    {
      title: '弹框测试',
      route: '/message',
      parentId: window.customize.winId,
      data: { text: '123' }
    },
    {
      width: 440,
      height: 220,
      modal: true,
      resizable: true
    }
  );
};

const [date, dateElement] = useElement(Date());
testInterval = setInterval(() => {
  date.value = Date();
}, 1000);

export const render = () => {
  return (
    <div class={style}>
      <div>{dateElement}</div>
      <button class="but" onClick={() => tk()}>
        弹框
      </button>
      <button class="but" onClick={() => shortcutGetAll().then(console.log)}>
        获取已注册shortcut
      </button>
      <button class="but" onClick={() => Router.push('/about')}>
        关于
      </button>
      <button class="but" onClick={() => Router.push('/music')}>
        music
      </button>
    </div>
  );
};
