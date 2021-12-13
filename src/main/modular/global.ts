import { app, ipcMain } from 'electron';
import { accessSync, constants } from 'fs';
import { resolve, join, normalize } from 'path';
import { logError } from '@/main/modular/log';
import { readFile } from './file';

type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

interface Config {
  path: string;
  seat: string;
  parse: boolean;
  opt?: { encoding?: BufferEncoding; flag?: string };
}

/**
 * Global
 */
export class Global {
  private static instance: Global;

  public sharedObject: { [key: string]: any } = {};

  static getInstance() {
    if (!Global.instance) Global.instance = new Global();
    return Global.instance;
  }

  constructor() {}

  /**
   * 挂载配置
   * @param path 配置文件路径
   * @param seat 存放位置
   * @param parse 是否parse
   * @param opt
   */
  async use(conf: Config | Config[]) {
    if (Array.isArray(conf)) {
      for (let index = 0; index < conf.length; index++) {
        const c = conf[index];
        try {
          const cfg = (await readFile(c.path, c.opt || { encoding: 'utf-8' })) as any;
          if (cfg) this.sendGlobal(c.seat, c.parse ? JSON.parse(cfg) : cfg);
        } catch (e) {
          logError(`[cfg ${c.path}]`, e);
        }
      }
    } else {
      try {
        const cfg = (await readFile(conf.path, conf.opt || { encoding: 'utf-8' })) as any;
        if (cfg) this.sendGlobal(conf.seat, conf.parse ? JSON.parse(cfg) : cfg);
      } catch (e) {
        logError(`[cfg ${conf.path}]`, e);
      }
    }
  }

  /**
   * 开启监听
   */
  on() {
    //赋值(sharedObject)
    ipcMain.handle('global-sharedObject-set', (event, args) => {
      return this.sendGlobal(args.key, args.value);
    });
    //获取(sharedObject)
    ipcMain.handle('global-sharedObject-get', (event, key) => {
      return this.getGlobal(key);
    });
    //获取依赖路径
    ipcMain.handle('global-resources-path-get', (event, { type, path }) => {
      return this.getResourcesPath(type, path);
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

  sendGlobal<Value>(key: string, value: Value, exists: boolean = false): void {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.')) {
      if (Object.prototype.hasOwnProperty.call(this.sharedObject, key) && exists) {
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
    if (Object.prototype.hasOwnProperty.call(cur, lastKey) && exists) {
      console.warn(`The key ${key} looks like already exists on obj.`);
    }
    cur[lastKey] = value;
  }

  /**
   * 获取资源文件路径
   * 不传path返回此根目录
   * */
  getResourcesPath(type: 'platform' | 'inside' | 'extern' | 'root', path: string = './'): string {
    try {
      switch (type) {
        case 'platform':
          path = normalize(
            app.isPackaged
              ? resolve(join(__dirname, '..', '..', '..', 'platform', process.platform, path))
              : resolve(join('resources', 'platform', process.platform, path))
          );
          break;
        case 'inside':
          path = normalize(
            app.isPackaged
              ? resolve(join(__dirname, '..', '..', 'inside', path))
              : resolve(join('resources', 'inside', path))
          );
          break;
        case 'extern':
          path = normalize(
            app.isPackaged
              ? resolve(join(__dirname, '..', '..', '..', 'extern', path))
              : resolve(join('resources', 'extern', path))
          );
          break;
        case 'root':
          path = normalize(
            app.isPackaged
              ? resolve(join(__dirname, '..', '..', '..', '..', path))
              : resolve(join('resources', 'root', path))
          );
          break;
      }
      accessSync(path, constants.R_OK);
      return path;
    } catch (e) {
      logError(`[path ${path}]`, e);
      throw e;
    }
  }
}

export default Global.getInstance();
