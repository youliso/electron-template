import { windowShow } from '@youliso/electronic/ipc/window';
import { headStore } from '@/renderer/store';
import style from './style';

export const onReady = () => {
  windowShow();
};

export const render = () => {
  const webview = document.createElement('webview');
  webview.allowpopups = true;
  webview.addEventListener('page-title-updated', () =>
    headStore.actions.setTitle(webview.getTitle())
  );
  webview.innerText = 'loading..';
  webview.src = window.customize.url as string;
  return <div class={style}>{webview}</div>;
};
