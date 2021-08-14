type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

/**
 * 数据监听
 */
export function observer<T>(
  value: T,
  callback?: (target: T, p: string, value: any) => void
): Partial<{ value: T } & T> {
  const isObject = typeof value === 'object';
  const handler: ProxyHandler<any> = {
    get: (target, p) => {
      return target[p];
    },
    set: (target, p, value) => {
      if (target[p] !== value) {
        target[p] = value;
        callback(target, p as string, value);
      }
      return true;
    }
  };
  return isObject ? new Proxy(value, handler) : new Proxy({ value }, handler);
}

class Store {
  private static instance: Store;

  public data: { [key: string]: any } = {};

  static getInstance() {
    if (!Store.instance) Store.instance = new Store();
    return Store.instance;
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
}

export default Store.getInstance();
