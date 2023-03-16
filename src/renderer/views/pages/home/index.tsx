import { useElement } from '@youliso/granule';
import Router from '@/renderer/router';
import { windowCreate, windowShow } from '@youliso/electronic-ipc/window';
import { shortcutGetAll } from '@youliso/electronic-ipc/shortcut';
import style from './style';

let testInterval: NodeJS.Timer | undefined;

export const onUnmounted = () => {
  if (testInterval) clearInterval(testInterval);
};

export const onReady = () => {
  windowShow();
};

export const beforeRoute = async (to: string, from: string) => {
  console.log(to, from);
  return true;
};

const tk = () => {
  windowCreate(
    {
      title: '弹框测试',
      route: '/message',
      data: { text: '123' },
      center: true
    },
    {
      width: 440,
      height: 220,
      frame: false,
      show: false,
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
