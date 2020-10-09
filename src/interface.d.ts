declare interface DialogOpt {
    id?: number;
    width: number; //父类窗口宽度
    height: number; //父类窗口高度
    dialogName: string; //窗口名称
    uniQueKey: string; //窗口key
    route: string; // 页面路由
    resizable: boolean; //是否支持调整窗口大小
    data?: object; //数据
    isMultiWindow?: boolean; //是否支持多窗口
    parent?: string | number; //父窗口
    modal?: boolean; //父窗口置顶
    returnPath?: string; //数据返回路径
}

declare interface IpcMessageOpt {
    type: string;
    key: string;
    value: unknown;
}
