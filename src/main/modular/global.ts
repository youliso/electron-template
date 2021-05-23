import { app, ipcMain, shell } from 'electron';
import { Platform } from './platform';
import { resolve } from 'path';
import { EOL } from 'os';

type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

/**
 * Global
 */
export class Global {
  private static instance: Global;

  public sharedObject: { [key: string]: any } = {
    system: {
      //系统信息
      EOL,
      version: process.getSystemVersion(),
      platform: process.platform
    },
    app: {
      //应用信息
      name: app.name,
      version: app.getVersion(),
      dom: {
        //dom常量集
        class: [process.platform],
        css: {}
      }
    }
  };

  static getInstance() {
    if (!Global.instance) Global.instance = new Global();
    return Global.instance;
  }

  constructor() {}

  async init() {
    Platform[process.platform]();
  }

  /**
   * 开启监听
   */
  on() {
    //app常用获取路径
    ipcMain.on('app-path-get', (event, args) => {
      event.returnValue = app.getPath(args.key);
    });
    //app打开外部url
    ipcMain.on('app-open-url', (event, args) => {
      shell.openExternal(args.url).then();
    });
    //赋值(sharedObject)
    ipcMain.on('global-sharedObject-set', (event, args) => {
      this.sendGlobal(args.key, args.value);
      event.returnValue = 1;
    });
    //获取(sharedObject)
    ipcMain.on('global-sharedObject-get', (event, key) => {
      event.returnValue = this.getGlobal(key);
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

  getGlobal<Value>(key: string): Value | undefined {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.') && Object.prototype.hasOwnProperty.call(this.sharedObject, key)) {
      return this.sharedObject[key] as Value;
    }

    const levels = key.split('.');
    let cur = this.sharedObject;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level] as unknown as Obj<Value>;
      } else {
        return;
      }
    }

    return cur as unknown as Value;
  }

  sendGlobal<Value>(key: string, value: Value): void {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.')) {
      if (Object.prototype.hasOwnProperty.call(this.sharedObject, key)) {
        console.warn(`The key ${key} looks like already exists on obj.`);
      }
      this.sharedObject[key] = value;
    }

    const levels = key.split('.');
    const lastKey = levels.pop()!;

    let cur = this.sharedObject;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level];
      } else {
        console.error(`Cannot set value because the key ${key} is not exists on obj.`);
        return;
      }
    }

    if (typeof cur !== 'object') {
      console.error(`Invalid key ${key} because the value of this key is not a object.`);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(cur, lastKey)) {
      console.warn(`The key ${key} looks like already exists on obj.`);
    }
    cur[lastKey] = value;
  }

  /**
   * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
   * @param path lib/inside为起点的相对路径
   * */
  getInsidePath(path: string): string {
    return app.isPackaged
      ? resolve(__dirname, '../inside/' + path)
      : resolve('./src/lib/inside/' + path);
  }

  /**
   * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
   * @param path lib/extern为起点的相对路径
   * */
  getExternPath(path: string): string {
    return app.isPackaged
      ? resolve(__dirname, '../../extern/' + path)
      : resolve('./src/lib/extern/' + path);
  }
}

export default Global.getInstance();
