/**
 * 关闭打印进程
 */
export function printerQuit() {
  window.ipc.send('printer-quit');
}

/**
 * 获取当前打印机列表
 */
export async function printerAll() {
  return window.ipc.sendSync('printer-all');
}

/**
 * 打印
 */
export async function printerDo(args: {
  landscape?: boolean;
  wh: number[];
  displayName: string;
  html: string;
}) {
  args.landscape = false;
  window.ipc.send('printer-do', args);
}
