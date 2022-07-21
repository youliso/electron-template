import { useDV } from '@youliso/web-modules';
import Router from '@/renderer/router';
import { windowCreate, windowShow } from '@youliso/electron-modules/renderer/window';
import { shortcutGetAll } from '@youliso/electron-modules/renderer/shortcut';
import style from './style';

export default class Home {
  private fileInterval: NodeJS.Timer | undefined;
  private testInterval: NodeJS.Timer | undefined;

  onLoad() {}

  onReady() {
    windowShow();
  }

  onUnmounted() {
    if (this.testInterval) clearInterval(this.testInterval);
    if (this.fileInterval) clearInterval(this.fileInterval);
  }

  beforeRoute(to: string, from: string, next: () => void) {
    console.log(to, from);
    next();
  }

  render() {
    function tk() {
      windowCreate(
        {
          title: '弹框测试',
          route: '/message',
          parentId: window.customize.id,
          data: { text: '123' }
        },
        {
          width: 440,
          height: 220,
          modal: true,
          resizable: true
        }
      );
    }

    const [data, view] = useDV(Date(), 'div', 'text');
    this.testInterval = setInterval(() => {
      data.value = Date();
    }, 1000);

    return (
      <div class={style}>
        {view}
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
  }
}
