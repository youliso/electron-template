import { app, Menu, Tray, nativeImage } from 'electron';
import { join } from 'path';
import Window from '@/main/modular/window';
import ico from '@/lib/assets/icon/tray.png';

class Trays {
  private static instance: Trays;

  public main: Tray = null; //托盘

  static getInstance() {
    if (!Trays.instance) Trays.instance = new Trays();
    return Trays.instance;
  }

  constructor() {}

  /**
   * 创建托盘
   * */
  create() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示',
        click: () => Window.func('show')
      },
      {
        label: '退出',
        click: () => app.quit()
      }
    ]);
    this.main = new Tray(nativeImage.createFromPath(join(__dirname, `../${ico}`)));
    this.main.setContextMenu(contextMenu);
    this.main.setToolTip(app.name);
    this.main.on('click', () => Window.func('show'));
  }

  /**
   * 监听
   */
  on() {}
}

export default Trays.getInstance();
