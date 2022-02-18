import { h } from '@/renderer/common/h';
import Router from '@/renderer/router';

export default class About implements View {
  styles = [import('./style/index.l.scss')];

  render() {
    return (
      <div class="info">
        <div class="text">关于</div>
        <button class="but" onClick={() => Router.back()}>
          首页
        </button>
      </div>
    );
  }
}
