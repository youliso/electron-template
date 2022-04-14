type ProxyValue<T> = { value: T };
type ViewParameters = { query?: any; params?: any };

interface Route {
  path: string;
  name?: string;
  instance?: boolean;
  component: any;
}

interface VSource {
  $el?: JSX.Element;
  onLoad?: (parame: ViewParameters) => void;
  onReady?: () => void;
  onUnmounted?: () => void;
  onActivated?: (parame: ViewParameters) => void;
  onDeactivated?: () => void;
  render?: () => JSX.Element | JSX.Element[];
}

interface Component extends VSource {
  $key?: string;
  $currentPath?: string;
  onLoad?: () => void;
  onActivated?: () => void;
  render?: () => JSX.Element;
}

interface View extends VSource {
  $instance?: boolean;
  beforeRoute?: (to: string, from: string, next?: () => void) => boolean;
}

declare module '*.svg';
declare module '*.png';
declare module '*.ico';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
