type StoreProxy<T> = { proxy: T & { value: T }; revoke: () => void };

interface Store {
  set<Value>(key: string, value: Value): void;

  get<Value>(key: string): Value | undefined;

  proxy<T>(value: T, callback?: (value: any, p: string, target: any) => void): StoreProxy<T>;

  proxy<T>(
    key: string,
    value: T,
    callback?: (value: any, p: string, target: any) => void
  ): StoreProxy<T>;

  getProxy<T>(key: string): StoreProxy<T>;

  removeProxy<T>(key: string): void;
}

interface Route {
  path: string;
  instance?: boolean;
  component: () => Promise<any>;
}

interface RouteParams {
  // 销毁单例(仅在单例模式生效)
  unInstance?: boolean;
  data?: any;
}

interface OldVCKey {
  c: string[];
  v: string;
}

interface VSource {
  $name?: string;
  $el?: HTMLElement;
  components?: { [key: string]: Component };
  onLoad?: (params?: RouteParams) => void;
  onReady?: () => void;
  onUnmounted?: () => void;
  onActivated?: (params?: RouteParams) => void;
  onDeactivated?: () => void;
  render?: () => HTMLElement;
}

interface Component extends VSource {
  $currentName: string;
}

interface View extends VSource {
  $instance?: boolean;
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
