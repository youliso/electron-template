/**
 * 打开menu
 */
export function menuShow() {
  window.ipcFun.send('menu-show');
}
