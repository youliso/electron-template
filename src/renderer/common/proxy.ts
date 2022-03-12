function newProxy(data: any, callback: Function) {
  return new Proxy(data, {
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

export function proxy<T>(
  value: T,
  callback?: (value: any, p: string, target: any) => void
): ProxyValue<T>;
export function proxy(value: any, callback?: Function) {
  return newProxy(
    { value },
    (value: any, p: string, target: any) => callback && callback(value, p, target)
  );
}

export function proxys<T>(value: T, callback?: (value: any, p: string, target: any) => void): T;
export function proxys(value: any, callback?: Function) {
  return newProxy(
    value,
    (value: any, p: string, target: any) => callback && callback(value, p, target)
  );
}
