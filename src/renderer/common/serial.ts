import type { PortInfo } from '@serialport/bindings-cpp';
import type { IpcRendererEvent } from 'electron';

/**
 * 获取串口列表
 */
export async function serialportList(): Promise<PortInfo[]> {
  return await window.ipc.invoke('serialport-list');
}

/**
 * 关闭串口
 * @param key
 */
export async function serialClose(key: string) {
  await window.ipc.invoke('serial-close', { key });
}

/**
 * 发送消息
 */
export async function serialSend(args: { key: string; value: any }) {
  await window.ipc.invoke('serial-send', args);
}

/**
 * 开启串口
 */
export async function serialOpen(
  arg: {
    key: string;
    type: 'Byt' | 'Str';
    mode: 'port' | 'tcp';
    argument?: any;
    delimiter: number | string | null;
  },
  single: boolean = true,
  winId?: number
): Promise<number> {
  arg.argument = arg.argument || {};
  return await window.ipc.invoke('serial-open', { arg, single, winId });
}

/**
 * 开启全局监听
 * @param listener
 */
export function serialOnAll(
  listener: (
    event: IpcRendererEvent,
    args: { key: string; value: number[] | string; type: string }
  ) => void
) {
  window.ipc.on(`serial-on-back-all`, listener);
}

/**
 * 关闭全局监听
 */
export function serialOnAllRemove() {
  window.ipc.removeAllListeners(`serial-on-back-all`);
}

/**
 * 开启监听
 * @param listener
 */
export function serialOn(
  key: string,
  listener: (
    event: IpcRendererEvent,
    args: { key: string; value: number[] | string; type: string }
  ) => void
) {
  window.ipc.on(`serial-on-back-${key}`, listener);
}

/**
 * 关闭监听
 */
export function serialOnRemove(key: string) {
  window.ipc.removeAllListeners(`serial-on-back-${key}`);
}
