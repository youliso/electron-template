import { h } from '@/renderer/common/h';
import indexCss from './scss/index.lazy.scss';
import { nes_load, nes_un } from './demo';

export default class Game implements View {
  styles = [indexCss];

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
      </div>
    );
  }
}
