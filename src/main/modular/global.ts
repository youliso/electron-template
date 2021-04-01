import { app, ipcMain } from 'electron';
import { readFile } from '@/lib/file';
import { Platform } from './platform';
import { resolve } from 'path';

/**
 * Global
 */
export class Global {

  private static instance: Global;

  public sharedObject: { [key: string]: any } = {
    platform: process.platform, //当前运行平台
    appInfo: {
      //应用信息
      name: app.name,
      version: app.getVersion()
    }
  };

  static getInstance() {
    if (!Global.instance) Global.instance = new Global();
    return Global.instance;
  }

  constructor() {
  }

  async init() {
    try {
      const setting = await readFile(this.getExternPath('setting.json'));
      this.sharedObject['setting'] = JSON.parse(setting as string);
    } catch (e) {
      this.sharedObject['setting'] = {};
    }
    Platform[this.sharedObject.platform](this);
    this.on();
  }

  /**
   * 开启监听
   */
  on() {
    //赋值(sharedObject)
    ipcMain.on('global-sharedObject-set', (event, args) => {
      this.sharedObject[args.key] = args.value;
      event.returnValue = 1;
    });
    //获取(sharedObject)
    ipcMain.on('global-sharedObject-get', (event, key) => {
      event.returnValue = this.sharedObject[key];
    });
    //获取(insidePath)
    ipcMain.on('global-insidePath-get', (event, path) => {
      event.returnValue = this.getInsidePath(path);
    });
    //获取(externPath)
    ipcMain.on('global-externPath-get', (event, path) => {
      event.returnValue = this.getExternPath(path);
    });
  }

  /**
   * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
   * @param path lib/inside为起点的相对路径
   * */
  getInsidePath(path: string): string {
    return app.isPackaged ? resolve(__dirname, '../inside/' + path) : resolve('./src/lib/inside/' + path);
  }

  /**
   * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
   * @param path lib/extern为起点的相对路径
   * */
  getExternPath(path: string): string {
    return app.isPackaged ? resolve(__dirname, '../../extern/' + path) : resolve('./src/lib/extern/' + path);
  }

}

export default Global.getInstance();
