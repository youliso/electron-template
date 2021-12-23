import type { ManagerOptions, SocketOptions } from 'socket.io-client';
import { ipcMain } from 'electron';
import Global from './global';
import Window from './window';
import { io, Socket as SocketIo } from 'socket.io-client';
import { logError } from '@/main/modular/log';
import { socketUrl, socketPath } from '@/cfg/net.json';

/**
 * Socket模块
 * */
export default class Socket {
  public io: SocketIo | undefined;

  /**
   * sockezt.io参数
   * 参考 ManagerOptions & SocketOptions
   * url https://socket.io/docs/v3/client-api/#new-Manager-url-options
   */
  public opts: Partial<ManagerOptions & SocketOptions> = {
    path: socketPath,
    auth: {
      authorization: Global.getGlobal<string>('authorization')
    }
  };

  constructor() {}

  /**
   * 开启通讯
   */
  open(callback: Function) {
    const message: { [key: string]: SocketMessage } = {
      connect: { code: 0, msg: '已连接' },
      disconnect: { code: 1, msg: '已断开' },
      close: { code: 2, msg: '已关闭' },
      error: { code: 3 },
      value: { code: 4 }
    };
    this.io = io(socketUrl, this.opts);
    this.io.on('connect', () => callback(message.connect));
    this.io.on('disconnect', () => callback(message.disconnect));
    this.io.on('message', (data) => {
      message.value.value = data;
      callback(message.value);
    });
    this.io.on('error', (err) => {
      message.error.msg = err;
      callback(message.error);
      logError(err);
    });
    this.io.on('close', () => callback(message.close));
  }

  /**
   * 重新连接
   */
  reconnection() {
    if (this.io && this.io.io._readyState === 'closed') this.io.open();
  }

  /**
   * 关闭
   */
  close() {
    if (this.io && this.io.io._readyState !== 'closed') this.io.close();
  }

  /**
   * 发送
   */
  send(args: any) {
    if (this.io && this.io.io._readyState !== 'closed') this.io.send(args);
  }

  /**
   * 开启监听
   */
  on() {
    //设置opts
    ipcMain.on('socket-setopts', async (event, args) => (this.opts = args));
    //重新连接
    ipcMain.on('socket-reconnection', async () => this.reconnection());
    //关闭
    ipcMain.on('socket-close', async () => this.close());
    //打开socket
    ipcMain.on('socket-open', async () => {
      if (!this.io)
        this.open((data: { key: string; value: any }) => Window.send('socket-back', data));
    });
    //发送消息
    ipcMain.on('socket-send', (event, args) => this.send(args));
  }
}
