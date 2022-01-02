type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

class Stores {
  private static instance: Stores;

  public indexData: { [key: string]: any } = {};

  public proxyData: { [key: string]: { proxy: any; revoke: () => void } } = {};

  static getInstance() {
    if (!Stores.instance) Stores.instance = new Stores();
    return Stores.instance;
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
}
const Store = Stores.getInstance();

function revocable(data: any, callback: Function) {
  return Proxy.revocable(data, {
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
}

export default Store;

export function ref<T>(
  key: string,
  value?: T,
  callback?: (value: any, p: string, target: any) => void
): RefValue<T>;
export function ref(key: string, value?: any, callback?: Function) {
  if (typeof key === 'string' && !value && !callback) return Store.proxyData[key]?.proxy;
  if (Store.proxyData[key]) {
    console.warn(`[ref] ${key} exists`);
    return;
  }
  if (!value || !callback) {
    console.warn(`[ref] ${key} not value|callback`);
    return;
  }
  const ob = revocable({ value }, callback);
  Store.proxyData[key] = ob;
  return ob.proxy;
}

export function reactive<T>(
  key: string,
  value?: T,
  callback?: (value: any, p: string, target: any) => void
): T;
export function reactive(key: string, value?: any, callback?: Function) {
  if (typeof key === 'string' && !value && !callback) return Store.proxyData[key]?.proxy;
  if (Store.proxyData[key]) {
    console.warn(`[reactive] ${key} exists`);
    return;
  }
  if (!value || !callback) {
    console.warn(`[reactive] ${key} not value|callback`);
    return;
  }
  const ob = revocable(value, callback);
  Store.proxyData[key] = ob;
  return ob.proxy;
}

export function revokeProxy(key: string) {
  const proxyData = Store.proxyData[key];
  if (proxyData) {
    proxyData.revoke();
    delete Store.proxyData[key];
  }
}
