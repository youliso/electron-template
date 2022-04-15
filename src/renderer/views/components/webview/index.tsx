import { windowShow } from '@/renderer/common/window';
import { titleStore } from '@/renderer/store';
import style from './style';

export default class {
  onReady() {
    windowShow();
  }

  render() {
    const webview = document.createElement('webview');
    webview.allowpopups = true;
    webview.addEventListener('page-title-updated', () =>
      titleStore.actions.set(webview.getTitle())
    );
    webview.innerText = 'loading..';
    webview.src = window.customize.url as string;
    return <div class={style}>{webview}</div>;
  }
}
