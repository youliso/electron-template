import { windowShow } from '@/renderer/common/window';
import { titleStore } from '@/renderer/store';
import style from './style';

export default class {
  onReady() {
    windowShow();
  }
  render() {
    const webview = document.createElement('webview');
    webview.src = window.customize.url as string;
    // webview.addEventListener('dom-ready', () => windowShow());
    webview.addEventListener('page-title-updated', () =>
      titleStore.actions.set(webview.getTitle())
    );
    return <div class={style}>{webview}</div>;
  }
}
