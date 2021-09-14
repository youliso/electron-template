type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

class Stores {
  private static instance: Stores;

  public indexData: { [key: string]: any } = {};

  public proxyData: { [key: string]: any } = {};

  static getInstance(): Store {
    if (!Stores.instance) Stores.instance = new Stores();
    return Stores.instance as Store;
  }

  constructor() {}

  get<Value>(key: string): Value | undefined {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.') && Object.prototype.hasOwnProperty.call(this.indexData, key)) {
      return this.indexData[key] as Value;
    }

    const levels = key.split('.');
    let cur = this.indexData;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level] as unknown as Obj<Value>;
      } else {
        return;
      }
    }
    return cur as unknown as Value;
  }

  set<Value>(key: string, value: Value, exists: boolean = false): void {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.')) {
      if (Object.prototype.hasOwnProperty.call(this.indexData, key) && exists) {
        console.log(`The key ${key} looks like already exists on obj.`);
      }
      this.indexData[key] = value;
    }

    const levels = key.split('.');
    const lastKey = levels.pop()!;

    let cur = this.indexData;
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
      console.log(`The key ${key} looks like already exists on obj.`);
    }
    cur[lastKey] = value;
  }

  proxy(...arg: any) {
    let key: string;
    let value: any;
    let callback: Function;
    if (arg.length === 3) {
      key = arg[0];
      if (typeof arg[1] === 'function') callback = arg[1];
      else value = arg[1];
      if (arg[2]) callback = arg[2];
    }
    if (arg.length === 2) {
      value = arg[0];
      if (arg[1]) callback = arg[1];
    }
    if (key) {
      const proxy = this.proxyData[key];
      if (proxy) return proxy;
    }
    let data = value;
    if (typeof value !== 'object' && !Array.isArray(value)) data = { value };
    const ob = Proxy.revocable(data, {
      get: (target, p) => {
        return target[p];
      },
      set: (target, p, value) => {
        if (target[p] !== value) {
          target[p] = value;
          callback(value, p as string, target);
        }
        return true;
      }
    });
    if (key) this.proxyData[key] = ob;
    return ob;
  }

  getProxy<T>(key: string): StoreProxy<T> {
    return this.proxyData[key];
  }

  removeProxy(key: string) {
    const proxy = this.proxyData[key];
    if (proxy) {
      proxy.revoke();
      delete this.proxyData[key];
    }
  }
}

export default Stores.getInstance();
