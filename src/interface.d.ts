declare interface WindowOpt {
    id?: number; //唯一id
    width?: number; //父类窗口宽度
    height?: number; //父类窗口高度
    route?: string; // 页面路由
    resizable?: boolean; //是否支持调整窗口大小
    data?: object; //数据
    isMultiWindow?: boolean; //是否支持多窗口
    isMainWin?: boolean; //是否主窗口
    parentId?: number; //父窗口id
    modal?: boolean; //父窗口置顶
}

declare interface IpcMessageOpt {
    type: IpcType;
    key?: string;
    value?: unknown;
}

declare enum IpcType {
    win,
    socket
}

declare interface socketMsg {
    key: SocketMsgType;
    value?: unknown;
}

declare enum SocketMsgType {
    error,
    success,
    init,
    close
}
