import { BrowserWindow, ipcMain, Menu, MenuItem, MenuItemConstructorOptions } from 'electron';

export class Menus {
  private menu: Menu = new Menu();

  constructor() {
  }

  init() {
  }

  /**
   * 监听
   */
  on() {
    ipcMain.on('menu-show', (event) => {
      const template: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
        {
          label: 'Menu Item 1',
          click: () => {
            event.sender.send('context-menu-command', 'menu-item-1');
          }
        },
        { type: 'separator' },
        { label: 'Menu Item 2', type: 'checkbox', checked: true }
      ];
      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(event.sender)
      });
    });
  }

}