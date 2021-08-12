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
 * 日期转换
 * @param fmt yy-MM-dd hh:mm:ss
 * */
export function dateFormat(fmt: string = 'yyyy-MM-dd hh:mm:ss'): string {
  let date = new Date();
  let o: { [key: string]: unknown } = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? (o[k] as string) : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}

/**
 * 深拷贝
 * @param sourceObj
 * @param targetObj
 */
export function deepClone<T>(sourceObj: T, targetObj: T): T {
  let cloneObj: any = {};
  if (!sourceObj || typeof sourceObj !== 'object' || (sourceObj as any).length === undefined) {
    return sourceObj;
  }
  if (sourceObj instanceof Array) {
    cloneObj = sourceObj.concat();
  } else {
    for (let i in sourceObj) {
      if (typeof sourceObj[i] === 'object') {
        cloneObj[i] = deepClone(sourceObj[i], {});
      } else {
        cloneObj[i] = sourceObj[i];
      }
    }
  }
  return cloneObj;
}

/**
 * 防抖
 */
export function debounce(fun: Function, wait: number): Function {
  let timer: number = null;
  return function () {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(fun, wait);
  };
}

/**
 * 节流
 */
export function throttle(fun: Function, delay: number): Function {
  let timer: number = null;
  let startTime = Date.now();
  return function () {
    let curTime = Date.now();
    let remaining = delay - (curTime - startTime);
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      fun.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(fun, remaining);
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
