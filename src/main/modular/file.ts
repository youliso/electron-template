import fs from 'fs';
import { createInterface } from 'readline';
import { resolve, dirname, extname } from 'path';
import { isNull } from '@/lib';
import { ipcMain } from 'electron';

/**
 * 读取目录下指定后缀文件
 * @param path
 * @param fileName
 */
export function fileBySuffix(path: string, fileName: string) {
  if (path.substr(0, 1) !== '/' && path.indexOf(':') === -1) path = resolve(path);
  try {
    let files: string[] = [];
    let dirArray = fs.readdirSync(path);
    for (let d of dirArray) {
      let filePath = resolve(path, d);
      let stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        files = files.concat(fileBySuffix(filePath, fileName));
      }
      if (stat.isFile() && extname(filePath) === fileName) {
        files.push(filePath);
      }
    }
    return files;
  } catch (e) {
    return null;
  }
}

/**
 * 删除目录和内部文件
 * */
export function delDir(path: string): void {
  if (path.substr(0, 1) !== '/' && path.indexOf(':') === -1) path = resolve(path);
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file) => {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

/**
 * 检查文件是否存在于当前目录中、以及是否可写
 * @return 0 不存在 1 只可读 2 存在可读写
 */
export function access(path: string) {
  if (path.substr(0, 1) !== '/' && path.indexOf(':') === -1) path = resolve(path);
  return new Promise((resolve) =>
    fs.access(path, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) err.code === 'ENOENT' ? resolve(0) : resolve(1);
      else resolve(2);
    })
  );
}

/**
 * 读取整个文件
 * @param path 文件路径
 * @param options 选项
 */
export function readFile(path: string, options?: { encoding?: BufferEncoding; flag?: string; }) {
  if (path.substr(0, 1) !== '/' && path.indexOf(':') === -1) path = resolve(path);
  return new Promise((resolve) =>
    fs.readFile(
      path,
      options,
      (err, data) => {
        if (err) resolve(0);
        resolve(data);
      })
  );
}

/**
 * 逐行读取
 * @param path
 * @param index
 */
export function readLine(path: string, index?: number): Promise<string | any[]> | null {
  if (path.substr(0, 1) !== '/' && path.indexOf(':') === -1) path = resolve(path);
  const io = createInterface({
    input: fs.createReadStream(path)
  });
  return new Promise((resolve) => {
    switch (index) {
      case -1:
        io.on('line', (line) => {
          line = line.replace(/(^\s*)|(\s*$)/g, '');
          io.close();
          if (isNull(line)) line = null;
          resolve(line);
        });
        break;
      default:
        let indes = 0;
        let data: any[] = [];
        io.on('line', (line) => {
          indes++;
          if (index && indes === index) io.close();
          line = line.replace(/(^\s*)|(\s*$)/g, '');
          if (!isNull(line)) data.push(line);
        });
        io.on('close', () => resolve(data));
    }
  });
}

/**
 * 覆盖数据到文件
 * @return 0 失败 1 成功
 */
export async function writeFile(path: string, data: string | Buffer, options?: { encoding?: BufferEncoding; mode?: number | string; flag?: string; }) {
  if (path.substr(0, 1) !== '/' && path.indexOf(':') === -1) path = resolve(path);
  if (await access(path) === 0) fs.mkdirSync(dirname(path), { recursive: true });
  return new Promise((resolve) =>
    fs.writeFile(path, data, options, (err) => {
      if (err) {
        resolve(0);
      }
      resolve(1);
    })
  );
}

/**
 * 追加数据到文件
 * @return 0 失败 1 成功
 */
export async function appendFile(path: string, data: string | Uint8Array, options?: { encoding?: BufferEncoding; mode?: number | string; flag?: string; }) {
  if (path.substr(0, 1) !== '/' && path.indexOf(':') === -1) path = resolve(path);
  if (await access(path) === 0) fs.mkdirSync(dirname(path), { recursive: true });
  return new Promise((resolve) =>
    fs.appendFile(path, data, options, (err) => {
      if (err) {
        resolve(0);
      }
      resolve(1);
    })
  );
}

/**
 * 监听
 */
export function fileOn() {
  ipcMain.handle('file-filebysuffix', async (event, args) => fileBySuffix(args.path, args.fileName));
  ipcMain.handle('file-deldir', async (event, args) => delDir(args.path));
  ipcMain.handle('file-access', async (event, args) => access(args.path));
  ipcMain.handle('file-readfile', async (event, args) => readFile(args.path, args.options));
  ipcMain.handle('file-readline', async (event, args) => readLine(args.path, args.index));
  ipcMain.handle('file-writefile', async (event, args) => writeFile(args.path, args.data, args.options));
  ipcMain.handle('file-appendfile', async (event, args) => appendFile(args.path, args.data, args.options));
}