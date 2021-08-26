type StoreProxy<T> = { proxy: T; revoke: () => void };

interface Store {
  set<Value>(key: string, value: Value): void;

  get<Value>(key: string): Value | undefined;

  proxy<T>(key: string, callback?: (value: any, p: string, target: any) => void): StoreProxy<T>;

  proxy<T>(value: T, callback?: (value: any, p: string, target: any) => void): StoreProxy<T>;

  proxy<T>(
    key: string,
    value: T,
    callback?: (value: any, p: string, target: any) => void
  ): StoreProxy<T>;

  removeProxy<T>(key: string): void;
}

interface Route {
  path: string;
  name: string;
  component: () => Promise<any>;
}

type RouteParams = any;

interface Component {
  // 组件名称
  name: string;
  // 是否全局组件
  global?: boolean;
  // 是否强制渲染(仅全局组件下生效)
  force?: boolean;
  // 组件元素
  dom: HTMLElement;
}

interface View {
  components?: Component[];
  dom: HTMLElement[];
}

declare module '*.lazy.scss' {
  // 加载
  function use(): void;

  // 移除
  function unuse(): void;
}
declare module '*.css';
declare module '*.scss';
declare module '*.svg';
declare module '*.png';
declare module '*.ico';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
