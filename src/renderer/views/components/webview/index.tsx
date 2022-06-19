import { windowShow, windowMessageOn } from 'ym-electron/renderer/window';
import { headStore } from '@/renderer/store';
import style from './style';

export default class {
  onLoad() {
    windowMessageOn((_, args) => {
      console.log('msg', args);
    });
  }
  onReady() {
    windowShow();
  }

  render() {
    const webview = document.createElement('webview');
    webview.allowpopups = true;
    webview.addEventListener('page-title-updated', () =>
      headStore.actions.setTitle(webview.getTitle())
    );
    webview.innerText = 'loading..';
    webview.src = window.customize.url as string;
    return <div class={style}>{webview}</div>;
  }
}
