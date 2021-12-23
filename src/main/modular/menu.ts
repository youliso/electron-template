import type { MenuItem, MenuItemConstructorOptions } from 'electron';
import { BrowserWindow, ipcMain, Menu, nativeImage } from 'electron';
import { join } from 'path';
import testIcon from '@/assets/icon/test.png';

export default class Menus {
  constructor() {}

  /**
   * 监听
   */
  on() {
    ipcMain.on('menu-show', (event) => {
      const template: Array<MenuItemConstructorOptions | MenuItem> = [
        {
          label: 'Menu Item 1',
          icon: nativeImage.createFromPath(join(__dirname, `../${testIcon}`)),
          click: () => {
            event.sender.send('menu-back', 'menu-item-1');
          }
        },
        { label: 'Menu Item 2', type: 'checkbox', checked: true }
      ];
      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(event.sender) as BrowserWindow
      });
    });
  }
}
