import { windowAlwaysOnTopOpt, WindowOpt, windowStatusOpt } from '@/lib/interface';
import { setMessageData } from '@/renderer/store';

/**
 * 窗口初始化 (i)
 * */
export async function windowLoad() {
  windowMessageOn();
  return new Promise(resolve => window.ipcFun.once('window-load', async (event, args) => resolve(args)));
}

/**
 * 窗口消息监听
 */
export function windowMessageOn() {
  window.ipcFun.on('window-message-back', (event, args) => setMessageData(args.key, args.value)); //监听消息反馈
}

/**
 * 消息发送
 */
export function windowMessageSend(args: { key: string; value: any; }) {
  window.ipcFun.send('window-message-send', args);
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
export function windowSetSize(id: number, size: number[], resizable: boolean = true, center: boolean = false) {
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