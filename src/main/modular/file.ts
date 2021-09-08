import fs, { MakeDirectoryOptions } from 'fs';
import { createInterface } from 'readline';
import { resolve, extname } from 'path';
import { ipcMain } from 'electron';

/**
 * 读取目录下指定后缀文件
 * @param path
 * @param suffix
 */
export function fileBySuffix(path: string, suffix: string) {
  try {
    let files: string[] = [];
    let dirArray = fs.readdirSync(path);
    for (let d of dirArray) {
      let filePath = resolve(path, d);
      let stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        files = files.concat(fileBySuffix(filePath, suffix));
      }
      if (stat.isFile() && extname(filePath) === suffix) {
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
 * 删除文件
 * @param path
 */
export function unlink(path: string) {
  return new Promise((resolve) =>
    fs.unlink(path, (err) => {
      if (err) resolve(0);
      else resolve(1);
    })
  );
}

/**
 * 检查文件是否存在于当前目录中、以及是否可写
 * @return 0 不存在 1 只可读 2 存在可读写
 */
export function access(path: string) {
  return new Promise((resolve) =>
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) err.code === 'ENOENT' ? resolve(0) : resolve(1);
      else resolve(2);
    })
  );
}

/**
 * 文件重命名
 * @return 0 失败 1 成功
 */
export function rename(path: string, newPath: string) {
  return new Promise((resolve) => {
    fs.rename(path, newPath, (err) => {
      if (err) resolve(0);
      else resolve(1);
    });
  });
}

/**
 * 读取整个文件
 * @param path 文件路径
 * @param options 选项
 */
export function readFile(path: string, options?: { encoding?: BufferEncoding; flag?: string }) {
  return new Promise((resolve) =>
    fs.readFile(path, options, (err, data) => {
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
  const io = createInterface({
    input: fs.createReadStream(path)
  });
  return new Promise((resolve) => {
    switch (index) {
      case -1:
        io.on('line', (line) => {
          line = line.replace(/(^\s*)|(\s*$)/g, '');
          io.close();
          if (!line) line = null;
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
          if (line) data.push(line);
        });
        io.on('close', () => resolve(data));
    }
  });
}

/**
 * 创建目录
 * @param path
 * @param options
 * @returns 0 失败 1成功
 */
export async function mkdir(path: string, options: MakeDirectoryOptions) {
  return new Promise((resolve) => {
    fs.mkdir(path, options || { recursive: true }, (err) => {
      if (err) {
        resolve(0);
      }
      resolve(1);
    });
  });
}

/**
 * 创建文件
 * @return 0 失败 1 成功
 */
export async function writeFile(
  path: string,
  data: string | Buffer,
  options?: { encoding?: BufferEncoding; mode?: number | string; flag?: string }
) {
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
export async function appendFile(
  path: string,
  data: string | Uint8Array,
  options?: { encoding?: BufferEncoding; mode?: number | string; flag?: string }
) {
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
  ipcMain.handle('file-filebysuffix', async (event, args) =>
    fileBySuffix(args.path, args.fileName)
  );
  ipcMain.handle('file-mkdir', async (event, args) => mkdir(args.path, args.options));
  ipcMain.handle('file-deldir', async (event, args) => delDir(args.path));
  ipcMain.handle('file-unlink', async (event, args) => unlink(args.path));
  ipcMain.handle('file-access', async (event, args) => access(args.path));
  ipcMain.handle('file-rename', async (event, args) => rename(args.path, args.newPath));
  ipcMain.handle('file-readfile', async (event, args) => readFile(args.path, args.options));
  ipcMain.handle('file-readline', async (event, args) => readLine(args.path, args.index));
  ipcMain.handle('file-writefile', async (event, args) =>
    writeFile(args.path, args.data, args.options)
  );
  ipcMain.handle('file-appendfile', async (event, args) =>
    appendFile(args.path, args.data, args.options)
  );
}
