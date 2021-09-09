import { globalShortcut, ipcMain } from 'electron';
import { deepCopy } from '@/lib';

export type Accelerator = {
  // 名称
  name?: string;
  key?: string;
  keys?: string[];
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
      if (accelerator.key === key || accelerator.keys.indexOf(key) !== -1) {
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
      if (accelerator.key === key || accelerator.keys.indexOf(key) !== -1) {
        this.data.splice(i, 1);
        break;
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
   * 注册快捷键
   * @param accelerator
   */
  register(accelerator: Accelerator) {
    globalShortcut.register(accelerator.key, accelerator.callback);
    this.set(accelerator);
  }

  /**
   * 批量注册快捷键
   * @param accelerator
   */
  registerAll(accelerator: Accelerator) {
    globalShortcut.registerAll(accelerator.keys, accelerator.callback);
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
    ipcMain.on('shortcut-register', (event, args) => this.register(args));
    ipcMain.on('shortcut-registerAll', (event, args) => this.registerAll(args));
    ipcMain.on('shortcut-unregister', (event, args) => this.unregister(args));
    ipcMain.on('shortcut-unregisterAll', () => this.unregisterAll());
    ipcMain.on('shortcut-get', (event, args) => {
      const accelerator = { ...this.get(args) };
      delete accelerator.callback;
      event.returnValue = accelerator;
    });
    ipcMain.on('shortcut-getAll', (event) => {
      const acceleratorAll = this.getAll();
      acceleratorAll.map((e) => delete e.callback);
      event.returnValue = acceleratorAll;
    });
  }
}

export default Shortcut.getInstance();
