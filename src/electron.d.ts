interface Customize {
  id?: number; //唯一id
  title?: string; //标题
  route: string; // 页面路由
  currentWidth?: number; //父类窗口宽度
  currentHeight?: number; //父类窗口高度
  currentMaximized?: boolean; //父类窗口是否全屏
  data?: any; //数据
  isMultiWindow?: boolean; //是否支持多窗口
  isMainWin?: boolean; //是否主窗口(当为true时会替代当前主窗口)
  parentId?: number; //父窗口id
}

declare namespace Electron {
  interface BrowserWindow {
    customize: Customize;
  }

  interface BrowserWindowConstructorOptions {
    customize: Customize;
  }
}

type windowAlwaysOnTopOpt =
  | 'normal'
  | 'floating'
  | 'torn-off-menu'
  | 'modal-panel'
  | 'main-menu'
  | 'status'
  | 'pop-up-menu'
  | 'screen-saver';

type windowFunOpt =
  | 'close'
  | 'hide'
  | 'show'
  | 'minimize'
  | 'maximize'
  | 'restore'
  | 'reload';

type windowStatusOpt =
  | 'isMaximized'
  | 'isMinimized'
  | 'isFullScreen'
  | 'isAlwaysOnTop'
  | 'isVisible'
  | 'isFocused'
  | 'isModal';