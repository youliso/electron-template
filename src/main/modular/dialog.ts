import { dialog, ipcMain } from 'electron';
import Window from './window';
export class Dialog {
  constructor() {}
  /**
   * 监听
   */
  on() {
    ipcMain.handle('open-dialog', (event, args) =>
      dialog.showOpenDialog(Window.getWindow(args.winId), args.params)
    );
  }
}
