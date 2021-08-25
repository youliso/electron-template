type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

interface Store {
  set<Value>(key: string, value: Value): void;

  get<Value>(key: string): Value | undefined;

  proxy<T>(
    value: T,
    callback?: (value: any, p: string, target: any) => void
  ): Partial<{ value: T } & T>;

  proxy<T>(
    key: string,
    value: T,
    callback?: (value: any, p: string, target: any) => void
  ): Partial<{ value: T } & T>;
}

class Stores {
  private static instance: Stores;

  public data: { [key: string]: any } = {};

  static getInstance(): Store {
    if (!Stores.instance) Stores.instance = new Stores();
    return Stores.instance;
  }

  constructor() {}

  get<Value>(key: string): Value | undefined {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.') && Object.prototype.hasOwnProperty.call(this.data, key)) {
      return this.data[key] as Value;
    }

    const levels = key.split('.');
    let cur = this.data;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level] as unknown as Obj<Value>;
      } else {
        return;
      }
    }

    return cur as unknown as Value;
  }

  set<Value>(key: string, value: Value): void {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.')) {
      if (Object.prototype.hasOwnProperty.call(this.data, key)) {
        console.log(`The key ${key} looks like already exists on obj.`);
      }
      this.data[key] = value;
    }

    const levels = key.split('.');
    const lastKey = levels.pop()!;

    let cur = this.data;
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
      console.log(`The key ${key} looks like already exists on obj.`);
    }
    cur[lastKey] = value;
  }

  proxy(...arg: any) {
    let key: string;
    let value: any;
    let callback: Function;
    if (typeof arg[0] === 'string') {
      key = arg[0];
      value = arg[1];
      if (arg[2]) callback = arg[2];
    } else {
      value = arg[0];
      if (arg[1]) callback = arg[1];
    }
    const isObject = typeof value === 'object';
    const handler: ProxyHandler<any> = {
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
    };
    const ob = isObject ? new Proxy(value, handler) : new Proxy({ value }, handler);
    if (key) this.set(key, ob);
    return ob;
  }
}

export default Stores.getInstance();
