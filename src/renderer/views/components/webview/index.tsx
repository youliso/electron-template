import style from './style';

export default class {
  render() {
    const webview = document.createElement('webview');
    webview.src = window.customize.url as string;
    return <div class={style}>{webview}</div>;
  }
}
