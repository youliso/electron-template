import Router from '@/renderer/router';
import style from './style';

export const render = () => {
  return (
    <div class={style}>
      <div class='test'>关于</div>
      <button onClick={() => Router.back()}>首页</button>
    </div>
  );
};
