import style from './style';
import { titleStore } from '@/renderer/store';

export default class {
  render() {
    const webview = document.createElement('webview');
    webview.src = window.customize.url as string;
    webview.addEventListener('page-title-updated', () =>
      titleStore.actions.set(webview.getTitle())
    );
    return <div class={style}>{webview}</div>;
  }
}
