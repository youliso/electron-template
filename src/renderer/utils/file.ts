/**
 * 读取目录下指定后缀文件
 * @param path
 * @param fileName
 */
export function fileBySuffix(path: string, fileName: string) {
  window.ipcFun.send('file-filebysuffix', { path, fileName });
}
