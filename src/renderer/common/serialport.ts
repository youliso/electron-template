import type { OpenOptions, PortInfo } from 'serialport';
import type { IpcRendererEvent } from 'electron';

/**
 * 校验和
 * @param buf
 */
export function xor(buf: number[]) {
  let Temp = 0;
  for (let i = 0; i < buf.length; i++) {
    Temp += buf[i];
  }
  return Temp;
}

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
export function serialportClose(key: string) {
  window.ipc.send('serialport-close', { key });
}

/**
 * 发送消息
 */
export function serialportSend(args: { key: string; value: any }) {
  window.ipc.send('serialport-send', args);
}

/**
 * 开启串口
 */
export async function serialportOpen(args: {
  key: string;
  type: 'Byt' | 'Str';
  delimiter: number | string | null;
  opt?: OpenOptions;
}) {
  window.ipc.send('serialport-open', args);
}

/**
 * 开启监听
 * @param listener
 */
export function serialOn(
  listener: (
    event: IpcRendererEvent,
    args: { key: string; value: number[] | string; type: string }
  ) => void
) {
  window.ipc.on('serial-back', listener);
}

/**
 * 关闭监听
 */
export function serialListenersRemove() {
  window.ipc.removeAllListeners(`serial-back`);
}
