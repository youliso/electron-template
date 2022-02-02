type RefValue<T> = { value: T };

interface Route {
  path: string;
  title?: string;
  instance?: boolean;
  component: any;
}

interface VSource {
  $path?: string;
  $el?: HTMLElement;
  styles?: any[];
  onLoad?: (params?: any) => void;
  onReady?: () => void;
  onUnmounted?: () => void;
  onActivated?: (params?: any) => void;
  onDeactivated?: () => void;
  render?: () => HTMLElement | HTMLElement[];
}

interface Component extends VSource {
  $currentPath?: string;
  onLoad?: () => void;
  onActivated?: () => void;
  render?: () => HTMLElement;
}

interface View extends VSource {
  $instance?: boolean;
  components?: { [key: string]: Component };
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
