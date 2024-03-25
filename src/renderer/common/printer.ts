/**
 * 关闭打印进程
 */
export function printerQuit() {
  window.printer.quit();
}

/**
 * 获取当前打印机列表
 */
export async function printerList() {
  return window.printer.list();
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
  window.printer.do(args);
}
