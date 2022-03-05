import Router from '@/renderer/router';
import style from './style';

export default class About {
  render() {
    return (
      <div class={style}>
        <div class="text">关于</div>
        <button class="but" onClick={() => Router.back()}>
          首页
        </button>
      </div>
    );
  }
}
