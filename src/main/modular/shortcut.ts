import { globalShortcut, ipcMain } from 'electron';
import { deepCopy } from '@/utils';
import Window from '@/main/modular/window';

export type Accelerator = {
  // 名称
  name: string;
  key: string | string[];
  callback: () => void;
};

class Shortcut {
  private static instance: Shortcut;

  private data: Accelerator[] = [];

  static getInstance() {
    if (!Shortcut.instance) Shortcut.instance = new Shortcut();
    return Shortcut.instance;
  }

  constructor() {}

  /**
   * 添加已注册快捷键
   * @param accelerator
   */
  private set(accelerator: Accelerator) {
    this.data.push(accelerator);
  }

  /**
   * 获取已注册快捷键
   * @param key
   */
  get(key: string) {
    for (let i = 0, len = this.data.length; i < len; i++) {
      const accelerator = this.data[i];
      if (
        (typeof accelerator.key === 'string' && accelerator.key === key) ||
        (Array.isArray(accelerator.key) && accelerator.key.indexOf(key) > -1)
      ) {
        return deepCopy<Accelerator>(accelerator);
      }
    }
    return null;
  }

  /**
   * 获取全部已注册快捷键
   */
  getAll() {
    return deepCopy<Accelerator[]>(this.data);
  }

  /**
   * 删除已注册快捷键
   * @param key
   */
  private del(key: string) {
    for (let i = 0, len = this.data.length; i < len; i++) {
      const accelerator = this.data[i];
      if (typeof accelerator.key === 'string' && accelerator.key === key) {
        this.data.splice(i, 1);
        break;
      }
      if (Array.isArray(accelerator.key)) {
        const index = accelerator.key.indexOf(key);
        if (index > -1) {
          accelerator.key.splice(index, 1);
          break;
        }
      }
    }
  }

  /**
   * 清空已注册快捷键
   */
  private delAll() {
    delete this.data;
    this.data = [];
  }

  /**
   * 注册快捷键 (重复注册将覆盖)
   * @param accelerator
   */
  register(accelerator: Accelerator) {
    this.unregister(accelerator.key);
    if (typeof accelerator.key === 'string')
      globalShortcut.register(accelerator.key, accelerator.callback);
    else globalShortcut.registerAll(accelerator.key, accelerator.callback);
    this.set(accelerator);
  }

  /**
   * 清除快捷键
   */
  unregister(key: string | string[]) {
    if (typeof key === 'string') {
      globalShortcut.unregister(key);
      this.del(key);
      return;
    }
    key.forEach((e) => {
      globalShortcut.unregister(e);
      this.del(e);
    });
  }

  /**
   * 清空全部快捷键
   */
  unregisterAll() {
    globalShortcut.unregisterAll();
    this.delAll();
  }

  /**
   * 监听
   */
  on() {
    ipcMain.handle('shortcut-register', (event, args: { name: string; key: string | string[] }) => {
      const accelerator: Accelerator = {
        ...args,
        callback: () => Window.send(`shortcut-back`, args.key)
      };
      return this.register(accelerator);
    });
    ipcMain.handle('shortcut-unregister', (event, args) => this.unregister(args));
    ipcMain.handle('shortcut-unregisterAll', () => this.unregisterAll());
    ipcMain.handle('shortcut-get', (event, args) => {
      const accelerator = { ...this.get(args) };
      delete accelerator.callback;
      return accelerator;
    });
    ipcMain.handle('shortcut-getAll', (event) => {
      const acceleratorAll = this.getAll();
      acceleratorAll.map((e) => delete e.callback);
      return acceleratorAll;
    });
  }
}

export default Shortcut.getInstance();
