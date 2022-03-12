import { useState } from '@/renderer/common/model';
import { getCustomize } from '@/renderer/store';
import Router from '@/renderer/router';
import {
  windowCreate,
  windowMessageOn,
  windowMessageRemove,
  windowShow
} from '@/renderer/common/window';
import { shortcutGetAll } from '@/renderer/common/shortcut';
import { menuShow } from '@/renderer/common/menu';
import style from './style';

const args = getCustomize();

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
    windowMessageOn('test', (_, args) => {
      console.log(args);
    });
  }

  unTest() {
    windowMessageRemove('test');
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
          parentId: args.id,
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

    function baidu() {
      windowCreate(
        {
          url: 'https://baidu.com/',
          parentId: args.id
        },
        {
          width: 1280,
          height: 720
        }
      );
    }

    const [data, view] = useState(Date(), 'div', 'text');
    this.testInterval = setInterval(() => {
      data.value = Date();
    }, 1000);
    
    return (
      <div class={style} onMouseDown={(e) => e.button === 2 && menuShow()}>
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
