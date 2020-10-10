import {ipcRenderer, remote} from "electron";

class Ipc {
    private static instance: Ipc;

    static getInstance() {
        if (!Ipc.instance) Ipc.instance = new Ipc();
        return Ipc.instance;
    }

    constructor() {
    }

    /**
     * 渲染进程初始化 (i)
     * */
    async Init() {
        return new Promise((resolve, reject) => {
            ipcRenderer.once('window-load', async (event, args) => {
                resolve(JSON.parse(decodeURIComponent(args)))
            })
        })
    }

    /**
     * 消息反馈 (i)
     */
    message(v: unknown) {
        return ipcRenderer.on('message-back', (event, args: IpcMessageOpt) => {
            v = args;
        })
    }

    /**
     * 消息发送
     */
    send(args: IpcMessageOpt) {
        ipcRenderer.send('message-send', args);
    }

    /**
     * 设置窗口大小
     * @param {number[]}size
     */
    setBounds(size: number[]) {
        return new Promise((resolve, reject) => {
            let Rectangle = {
                width: Math.floor(size[0]),
                height: Math.floor(size[1]),
                x: Math.floor(remote.getCurrentWindow().getPosition()[0] + ((remote.getCurrentWindow().getBounds().width - size[0]) / 2)),
                y: Math.floor(remote.getCurrentWindow().getPosition()[1] + ((remote.getCurrentWindow().getBounds().height - size[1]) / 2))
            }
            ipcRenderer.once('window-resize', () => {
                resolve();
            });
            remote.getCurrentWindow().setBounds(Rectangle);
        })
    }

    /**
     * 创建弹框 （dialogs）
     */
    dialogInit(data: DialogOpt, parent?: number) {
        let args: DialogOpt = {
            width: remote.getCurrentWindow().getBounds().width,
            height: remote.getCurrentWindow().getBounds().height,
            route: data.route, // 页面路由
            resizable: false,// 是否支持调整窗口大小
            data: data.data, //数据
            isMultiWindow: false, //是否支持多窗口
            modal: true //父窗口置顶
        };
        if (data.route === '/Message') args.parent = 'win'; //置顶于父窗口
        if (parent) args.parent = parent;
        if (data.returnPath) args.returnPath = data.returnPath;
        if (data.isMultiWindow) args.isMultiWindow = data.isMultiWindow;
        if (data.parent) args.parent = data.parent;
        if (data.modal) args.modal = data.modal;
        if (data.resizable) args.resizable = data.resizable;
        ipcRenderer.send('dialog-new', args);
    }

    /**
     * socket 初始化
     */
    socketInit(Authorization: string) {
        ipcRenderer.send('socket-init', Authorization);
    }

    /**
     * socket 重连
     */
    socketReconnection() {
        ipcRenderer.send('socket-reconnection');
    }

}

export default Ipc.getInstance();
