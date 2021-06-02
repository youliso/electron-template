import { IpcRendererEvent } from 'electron';
import { windowAlwaysOnTopOpt, WindowOpt, windowStatusOpt } from '@/lib/interface';
import { argsData } from '@/renderer/store';
import { domPropertyLoad } from './dom';

/**
 * 窗口初始化 (i)
 * */
export async function windowLoad() {
  return new Promise((resolve) =>
    window.ipcFun.once('window-load', async (event, args: WindowOpt) => {
      argsData.window = args;
      domPropertyLoad();
      resolve(true);
    })
  );
}

/**
 * 窗口消息监听
 */
export function windowMessageOn(
  channel: string,
  listener: (event: IpcRendererEvent, args: any) => void
) {
  window.ipcFun.on(`window-message-${channel}-back`, listener);
}

/**
 * 关闭窗口消息监听
 */
export function windowMessageRemove(channel: string) {
  window.ipcFun.removeAllListeners(`window-message-${channel}-back`);
}

/**
 * 消息发送
 */
export function windowMessageSend(
  channel: string, //监听key（保证唯一）
  value: any, //需要发送的内容
  isback: boolean = false, //是否给自身反馈
  acceptId: number = argsData.window.parentId //指定窗口id发送
) {
  window.ipcFun.send('window-message-send', {
    channel,
    value,
    isback,
    acceptId,
    id: argsData.window.id
  });
}

/**
 * 创建窗口
 */
export function windowCreate(args: WindowOpt) {
  window.ipcFun.send('window-new', args);
}

/**
 * 窗口状态
 */
export async function windowStatus(id: number, type: windowStatusOpt) {
  return await window.ipcFun.invoke('window-status', { type, id });
}

/**
 * 窗口置顶
 */
export function windowAlwaysOnTop(id: number, is: boolean, type?: windowAlwaysOnTopOpt) {
  window.ipcFun.send('window-always-top-set', { id, is, type });
}

/**
 * 设置窗口大小
 */
export function windowSetSize(
  id: number,
  size: number[],
  resizable: boolean = true,
  center: boolean = false
) {
  window.ipcFun.send('window-size-set', { id, size, resizable, center });
}

/**
 * 设置窗口最小大小
 */
export function windowSetMinSize(id: number, size: number[]) {
  window.ipcFun.send('window-min-size-set', { id, size });
}

/**
 * 设置窗口最小大小
 */
export function windowSetMaxSize(id: number, size: number[]) {
  window.ipcFun.send('window-max-size-set', { id, size });
}

/**
 * 设置窗口背景颜色
 */
export function windowSetBackgroundColor(id: number, color?: string) {
  window.ipcFun.send('window-bg-color-set', { id, color });
}

/**
 * 最大化&最小化当前窗口
 */
export function windowMaxMin(id: number) {
  window.ipcFun.send('window-max-min-size', id);
}

/**
 * 关闭窗口 (传id则对应窗口否则全部窗口)
 */
export function windowClose(id?: number) {
  window.ipcFun.send('window-fun', { type: 'close', id });
}

/**
 * 窗口显示
 */
export function windowShow(id?: number) {
  window.ipcFun.send('window-fun', { type: 'show', id });
}

/**
 * 窗口隐藏
 */
export function windowHide(id?: number) {
  window.ipcFun.send('window-fun', { type: 'hide', id });
}

/**
 * 最小化窗口 (传id则对应窗口否则全部窗口)
 */
export function windowMin(id?: number) {
  window.ipcFun.send('window-fun', { type: 'minimize', id });
}

/**
 * 最大化窗口 (传id则对应窗口否则全部窗口)
 */
export function windowMax(id?: number) {
  window.ipcFun.send('window-fun', { type: 'maximize', id });
}
