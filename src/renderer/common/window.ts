import type { IpcRendererEvent, BrowserWindowConstructorOptions } from 'electron';
import { getCustomize } from '@/renderer/store';

/**
 * 窗口初始化 (i)
 * */
export function windowLoad(listener: (event: IpcRendererEvent, args: Customize) => void) {
  window.ipc.once('window-load', listener);
}

/**
 * 窗口数据更新
 */
export function windowUpdate(customize?: Customize) {
  window.ipc.send('window-update', customize || getCustomize());
}

/**
 * 窗口聚焦失焦监听
 */
export function windowBlurFocusOn(
  listener: (event: IpcRendererEvent, args: 'blur' | 'focus') => void
) {
  window.ipc.on('window-blur-focus', listener);
}

/**
 * 关闭窗口聚焦失焦监听
 */
export function windowBlurFocusRemove() {
  window.ipc.removeAllListeners('window-blur-focus');
}

/**
 * 窗口大小化监听
 */
export function windowMaximizeOn(
  listener: (event: IpcRendererEvent, args: 'maximize' | 'unmaximize') => void
) {
  window.ipc.on('window-maximize-status', listener);
}

/**
 * 关闭窗口大小化监听
 */
export function windowMaximizeRemove() {
  window.ipc.removeAllListeners('window-maximize-status');
}

/**
 * 窗口消息监听
 */
export function windowMessageOn(
  channel: string,
  listener: (event: IpcRendererEvent, args: any) => void
) {
  window.ipc.on(`window-message-${channel}-back`, listener);
}

/**
 * 关闭窗口消息监听
 */
export function windowMessageRemove(channel: string) {
  window.ipc.removeAllListeners(`window-message-${channel}-back`);
}

/**
 * 消息发送
 */
export function windowMessageSend(
  channel: string, //监听key（保证唯一）
  value: any, //需要发送的内容
  isback: boolean = false, //是否给自身反馈
  acceptIds: number[] = [] //指定窗口id发送
) {
  const customize = getCustomize();
  if (acceptIds.length === 0 && typeof customize.parentId === 'number')
    acceptIds = [customize.parentId];
  window.ipc.send('window-message-send', {
    channel,
    value,
    isback,
    acceptIds,
    id: customize.id
  });
}

/**
 * 创建窗口
 */
export function windowCreate(customize: Customize, opt?: BrowserWindowConstructorOptions) {
  window.ipc.send('window-new', { customize, opt });
}

/**
 * 窗口状态
 */
export async function windowStatus(
  type: WindowStatusOpt,
  id: number = getCustomize().id as number
): Promise<boolean> {
  return await window.ipc.invoke('window-status', { type, id });
}

/**
 * 窗口置顶
 */
export function windowAlwaysOnTop(
  is: boolean,
  type?: WindowAlwaysOnTopOpt,
  id: number = getCustomize().id as number
) {
  window.ipc.send('window-always-top-set', { id, is, type });
}

/**
 * 设置窗口大小
 */
export function windowSetSize(
  size: number[],
  resizable: boolean = true,
  center: boolean = false,
  id: number = getCustomize().id as number
) {
  window.ipc.send('window-size-set', { id, size, resizable, center });
}

/**
 * 设置窗口 最大/最小 大小
 */
export function windowSetMaxMinSize(
  type: 'max' | 'min',
  size: number | undefined[],
  id: number = getCustomize().id as number
) {
  window.ipc.send(`window-${type}-size-set`, { id, size });
}

/**
 * 设置窗口背景颜色
 */
export function windowSetBackgroundColor(color: string, id: number = getCustomize().id as number) {
  window.ipc.send('window-bg-color-set', { id, color });
}

/**
 * 最大化&最小化当前窗口
 */
export function windowMaxMin(id: number = getCustomize().id as number) {
  window.ipc.send('window-max-min-size', id);
}

/**
 * 关闭窗口 (传id则对应窗口否则全部窗口)
 */
export function windowClose(id: number = getCustomize().id as number) {
  window.ipc.send('window-func', { type: 'close', id });
}

/**
 * 窗口显示
 * @param id 窗口id
 * @param time 延迟显示时间
 */
export function windowShow(time: number = 0, id: number = getCustomize().id as number) {
  setTimeout(() => window.ipc.send('window-func', { type: 'show', id }), time);
}

/**
 * 窗口隐藏
 */
export function windowHide(id: number = getCustomize().id as number) {
  window.ipc.send('window-func', { type: 'hide', id });
}

/**
 * 最小化窗口 (传id则对应窗口否则全部窗口)
 */
export function windowMin(id: number = getCustomize().id as number) {
  window.ipc.send('window-func', { type: 'minimize', id });
}

/**
 * 最大化窗口 (传id则对应窗口否则全部窗口)
 */
export function windowMax(id: number = getCustomize().id as number) {
  window.ipc.send('window-func', { type: 'maximize', id });
}

/**
 * window函数
 */
export function windowFunc(
  type: WindowFuncOpt,
  data?: any[],
  id: number = getCustomize().id as number
) {
  window.ipc.send('window-func', { type, data, id });
}

/**
 * 通过路由获取窗口id (不传route查全部)
 */
export async function windowIdGet(route?: string): Promise<number[]> {
  return await window.ipc.invoke('window-id-get', { route });
}
