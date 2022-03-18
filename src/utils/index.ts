/**
 * 判空
 * */
export function isNull(o: unknown): boolean {
  return o === '' || o === undefined || o === null || o === 'undefined' || o === 'null';
}

/**
 * 随机整数
 * 例如 6-10 （m-n）
 * */
export function ranDom(m: number, n: number): number {
  return Math.floor(Math.random() * (n - m)) + m;
}

/**
 * 数组元素互换
 * @param arr
 * @param index1 需要更换位置的元素初始下标
 * @param index2 更改后的下标
 */
export function swapArr<T>(arr: T[], index1: number, index2: number): void {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

/**
 * 对象转参数
 * @param data
 */
export function queryParams(data: any): string {
  let _result = [];
  for (let key in data) {
    let value = data[key];
    if (['', undefined, null].includes(value)) {
      continue;
    }
    if (value.constructor === Array) {
      value.forEach((_value) => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
      });
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  return _result.length ? _result.join('&') : '';
}

/**
 * 参数转对象
 * @param str
 */
export function toParams(str: string) {
  if (!str) return null;
  let obj: any = {},
    index = str.indexOf('?') || 0,
    params = str.substring(index + 1);
  let parr = params.split('&');
  for (let i of parr) {
    let arr = i.split('=');
    obj[arr[0]] = decodeURIComponent(arr[1]);
  }
  return obj;
}

/**
 * 深拷贝
 * @param obj
 */
export function deepCopy<T>(obj: any): T {
  const isArray = Array.isArray(obj);
  let result: any = {};
  if (isArray) result = [];
  let temp = null;
  let key = null;
  let keys = Object.keys(obj);
  keys.map((item, index) => {
    key = item;
    temp = obj[key];
    if (temp && typeof temp === 'object') {
      if (isArray) result.push(deepCopy(temp));
      else result[key] = deepCopy(temp);
    } else {
      if (isArray) result.push(temp);
      else result[key] = temp;
    }
  });
  return result;
}

/**
 * 防抖
 */
export function debounce(func: Function, wait: number): any {
  let timer: number | null = null;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments; // 存一下传入的参数
    if (timer) clearTimeout(timer);
    func.apply(context, args);
    timer = setTimeout(func, wait);
  };
}

/**
 * 节流
 */
export function throttle(func: Function, delay: number): any {
  let timer: number | null = null;
  let startTime = Date.now();
  return function () {
    const remaining = delay - (Date.now() - startTime);
    // @ts-ignore
    const context = this;
    const args = arguments;
    if (timer) clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(func, remaining);
    }
  };
}

/**
 * 指定范围内的随机整数
 * @param start
 * @param end
 */
export function random(start: number = 0, end: number = 1): number {
  return (Math.random() * (end - start + 1) + start) | 0;
}
