import { useDV } from 'ym-web';
import Router from '@/renderer/router';
import {
  windowCreate,
  windowMessageOn,
  windowMessageRemove,
  windowShow,
  windowMessageSend
} from 'ym-electron/renderer/window';
import { shortcutGetAll } from 'ym-electron/renderer/shortcut';
import style from './style';

export default class Home {
  private fileInterval: NodeJS.Timer | undefined;
  private testInterval: NodeJS.Timer | undefined;

  onLoad() {
    this.onTest();
  }

  onReady() {
    windowShow();
  }

  onUnmounted() {
    if (this.testInterval) clearInterval(this.testInterval);
    if (this.fileInterval) clearInterval(this.fileInterval);
    this.unTest();
  }

  onTest() {
    windowMessageOn((_, args) => {
      console.log(args);
    });
  }

  unTest() {
    windowMessageRemove();
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

    async function baidu() {
      const winId = await windowCreate(
        {
          title: 'baidu',
          url: 'https://baidu.com/',
          parentId: window.customize.id
        },
        {
          width: 1280,
          height: 720
        }
      );
      console.log('winId', winId);
      setTimeout(() => {
        windowMessageSend('测试数据', [winId as number]);
      }, 3000);
    }

    const [data, view] = useDV(Date(), 'div', 'text');
    this.testInterval = setInterval(() => {
      data.value = Date();
    }, 1000);

    return (
      <div class={style}>
        {view}
        <button class="but" onClick={() => baidu()}>
          百度
        </button>
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
