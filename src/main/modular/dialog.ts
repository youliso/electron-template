import { dialog, ipcMain } from 'electron';
import Window from '@/main/modular/window';
import { logError } from '@/main/modular/log';

export default class Dialog {
  constructor() {}
  /**
   * 监听
   */
  on() {
    ipcMain.handle('open-dialog', (event, args) => {
      const win = Window.get(args.winId);
      if (!win) {
        logError(`not found win -> ${args.winId}`);
        return;
      }
      dialog.showOpenDialog(win, args.params);
    });
  }
}
