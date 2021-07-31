import { dialog, ipcMain } from 'electron';
import Window from './window';
export default class Dialog {
  constructor() {}
  /**
   * 监听
   */
  on() {
    ipcMain.handle('open-dialog', (event, args) =>
      dialog.showOpenDialog(Window.get(args.winId), args.params)
    );
  }
}
