import type { WebContentsPrintOptions } from 'electron';
import { ipcMain, BrowserWindow } from 'electron';
import { windowInstance } from '@youliso/electronic/main/window';
import { resourcesPathGet } from '@/main/modular/resources';

export class Printer {
  win: BrowserWindow | null = null;

  data: any[] = [];

  async open() {
    this.win = new BrowserWindow({
      show: false,
      width: 0,
      height: 0,
      useContentSize: true,
      autoHideMenuBar: true,
      frame: true,
      webPreferences: {
        preload: windowInstance.defaultPreload,
        devTools: false,
        webSecurity: false
      }
    });
    this.win.customize = {
      isMainWin: false,
      silenceFunc: true
    };
    this.win.on('close', () => {
      this.win = null;
    });
    await this.win.loadFile(resourcesPathGet('inside', 'printer.html'));
  }

  async printOpt(args: any) {
    if (!this.win) return;
    const printers = await this.win.webContents.getPrintersAsync();
    const print = printers.filter((element) => element.displayName === args.displayName)[0];
    if (print) {
      let opt: WebContentsPrintOptions = {
        silent: true,
        landscape: args.landscape,
        printBackground: false,
        deviceName: print.displayName,
        pageRanges: [
          {
            from: 0,
            to: 0
          }
        ],
        margins: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        pageSize: {
          width: args.wh[0],
          height: args.wh[1]
        }
      };
      this.win.webContents.print(opt, (success, errorType) => {
        if (!success) console.error(errorType);
      });
    }
  }

  close() {
    this.win && this.win.close();
  }

  on() {
    //关闭打印机
    ipcMain.on('printer-quit', () => {
      if (this.win) this.win.close();
    });
    //获得打印机列表
    ipcMain.on('printer-all', (event) => {
      if (!this.win) return;
      this.win.webContents.getPrintersAsync().then((p) => (event.returnValue = p));
    });
    //打印传参
    ipcMain.on('printer-do', (event, args) => {
      if (!this.win) return;
      this.win.webContents.send('printer-setting', args);
    });
    //打印
    ipcMain.on('printer-dos', (event, { args, size }) => {
      if (!this.win) return;
      this.win.setSize(size[0], size[1]);
      this.printOpt(args);
    });
  }
}
