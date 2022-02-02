interface Customize {
  // 唯一id
  id?: number;
  // 标题 (仅路由下生效)
  title?: string;
  // 是否使用原生标签栏（路由下默认关闭）
  headNative?: boolean;
  // 指定网页
  url?: string;
  // 指定路由
  route?: string;
  // 参数数据
  loadOptions?: Electron.LoadURLOptions | Electron.LoadFileOptions;
  // 父类窗口宽度
  currentWidth?: number;
  // 父类窗口高度
  currentHeight?: number;
  // 父类窗口是否全屏
  currentMaximized?: boolean;
  // 此路由是否单窗口
  isOneWindow?: boolean;
  // 是否主窗口
  isMainWin?: boolean;
  // 父窗口id
  parentId?: number;
  // 进程参数
  argv?: any;
  // 自定义参数
  data?: any;
}

interface AppInfo {
  name: string;
  version: string;
}

declare namespace Electron {
  interface BrowserWindow {
    customize: Customize;
  }

  interface BrowserWindowConstructorOptions {
    customize?: Customize;
  }
}

type WindowAlwaysOnTopOpt =
  | 'normal'
  | 'floating'
  | 'torn-off-menu'
  | 'modal-panel'
  | 'main-menu'
  | 'status'
  | 'pop-up-menu'
  | 'screen-saver';

type WindowFuncOpt = 'close' | 'hide' | 'show' | 'minimize' | 'maximize' | 'restore' | 'reload';

type WindowStatusOpt =
  | 'isMaximized'
  | 'isMinimized'
  | 'isFullScreen'
  | 'isAlwaysOnTop'
  | 'isVisible'
  | 'isFocused'
  | 'isModal';

interface UpdateMessage {
  code: number;
  msg: string;
  value?: any;
}

interface SocketMessage {
  code: number;
  msg?: string;
  value?: any;
}
