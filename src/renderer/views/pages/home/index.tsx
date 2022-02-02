import { h, f } from '@/renderer/common/h';
import { ref, revokeProxy } from '@/renderer/common/store';
import { getCustomize } from '@/renderer/store';
import Router from '@/renderer/router';
import {
  windowCreate,
  windowMessageOn,
  windowMessageRemove,
  windowShow
} from '@/renderer/common/window';
import { dateFormat } from '@/utils';
import { shortcutGetAll } from '@/renderer/common/shortcut';
import { menuShow } from '@/renderer/common/menu';
import indexCss from './scss/index.lazy.scss';

const args = getCustomize();

export default class Home implements View {
  private testData: RefValue<string> | undefined;
  private testInterval: NodeJS.Timer | undefined;
  styles = [indexCss];

  onLoad() {
    this.onTest();
  }

  onReady() {
    windowShow();
  }

  onUnmounted() {
    if (this.testData) revokeProxy('test');
    if (this.testInterval) clearInterval(this.testInterval);
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

  testRender() {
    const test = <div class="text">{dateFormat()}</div>;
    this.testData = ref('test', dateFormat(), (value) => (test.textContent = value));
    this.testInterval = setInterval(() => {
      (this.testData as RefValue<string>).value = dateFormat();
    }, 1000);
    return test;
  }

  render() {
    function tk() {
      windowCreate(
        {
          headNative: true,
          title: '弹框测试',
          route: '/message',
          parentId: args.id,
          data: { text: '123' }
        },
        {
          width: 400,
          height: 200,
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

    return (
      <div class="info" onMouseDown={(e) => e.button === 2 && menuShow()}>
        {this.testRender()}
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
        <>
          <button class="but" onClick={() => Router.push('/game')}>
            game
          </button>
        </>
      </div>
    );
  }
}
