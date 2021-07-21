/**
 * 打开menu
 */
export function menuShow() {
  window.ipc.send('menu-show');
}
