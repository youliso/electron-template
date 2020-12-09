export interface WindowOpt {
    id?: number; //唯一id
    currentWidth?: number; //父类窗口宽度
    currentHeight?: number; //父类窗口高度
    width?: number;
    height?: number;
    route?: string; // 页面路由
    resizable?: boolean; //是否支持调整窗口大小
    data?: unknown; //数据
    isMultiWindow?: boolean; //是否支持多窗口
    isMainWin?: boolean; //是否主窗口(当为true时会替代当前主窗口)
    parentId?: number; //父窗口id
    modal?: boolean; //父窗口置顶
}

export interface IpcMsg {
    type: IPC_MSG_TYPE;
    key?: string;
    value?: unknown;
}

export interface SocketMsg {
    key: SOCKET_MSG_TYPE;
    value?: unknown;
}

export enum IPC_MSG_TYPE {
    WIN,
    SOCKET
}

export enum SOCKET_MSG_TYPE {
    ERROR,
    SUCCESS,
    INIT,
    CLOSE
}
