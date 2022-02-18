import { h } from '@/renderer/common/h';
import { nes_load, nes_un } from './demo';
import router from '@/renderer/router';

export default class Game implements View {
  styles = [import('./style/index.l.scss')];

  onUnmounted() {
    nes_un();
  }

  render() {
    const canvas = (<canvas class="game" width="256" height="240"></canvas>) as HTMLCanvasElement;
    nes_load(canvas, 'nesrom/Contra.nes');
    return (
      <div class="info">
        <div class="game">{canvas}</div>
        <div class="tip">
          Start: Return
          <br />
          Select: Tab
          <br />
          A Button: A
          <br />B Button: S
        </div>
        <button class="but" onClick={() => router.back()}>
          返回
        </button>
      </div>
    );
  }
}
