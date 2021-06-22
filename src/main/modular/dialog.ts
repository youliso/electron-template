import { dialog, ipcMain } from 'electron';
import Window from './window';
export class Dialog {
  constructor() {}
  /**
   * 监听
   */
  on() {
    ipcMain.handle('open-dialog', (event, args) =>
      dialog.showOpenDialog(Window.windowGet(args.winId), args.params)
    );
  }
}
