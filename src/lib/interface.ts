export interface AppInfo {
  name: string;
  version: string;
  accentColor?: string;
}

export interface WindowOpt {
  id?: number; //唯一id
  title?: string; //窗口标题
  currentWidth?: number; //父类窗口宽度
  currentHeight?: number; //父类窗口高度
  currentMaximized?: boolean; //父类窗口是否全屏
  width?: number;
  height?: number;
  route?: string; // 页面路由
  resizable?: boolean; //是否支持调整窗口大小
  backgroundColor?: string, //窗口背景色
  data?: unknown; //数据
  isMultiWindow?: boolean; //是否支持多窗口
  isMainWin?: boolean; //是否主窗口(当为true时会替代当前主窗口)
  parentId?: number; //父窗口id
  modal?: boolean; //父窗口置顶
  platform?: NodeJS.Platform;
  appInfo?: AppInfo;
}

export type windowAlwaysOnTopOpt =
  'normal'
  | 'floating'
  | 'torn-off-menu'
  | 'modal-panel'
  | 'main-menu'
  | 'status'
  | 'pop-up-menu'
  | 'screen-saver';

export type windowFunOpt = 'close' | 'hide' | 'show' | 'minimize' | 'maximize' | 'restore' | 'reload';

export type windowStatusOpt =
  'isMaximized'
  | 'isMinimized'
  | 'isFullScreen'
  | 'isAlwaysOnTop'
  | 'isVisible'
  | 'isFocused'
  | 'isModal';