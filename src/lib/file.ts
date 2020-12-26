import fs from "fs";
import {createInterface} from "readline";
import {resolve, dirname, extname} from "path";
import Log from "@/lib/log";
import {isNull} from "@/lib";

/**
 * 读取目录下指定后缀文件
 * @param path
 * @param fileName
 */
export function findFileBySuffix(path: string, fileName: string) {
    if (path.substr(0, 1) !== "/") path = resolve(path);
    let files: string[] = [];
    let dirArray = fs.readdirSync(path)
    for (let d of dirArray) {
        let filePath = resolve(path, d)
        let stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            files = files.concat(findFileBySuffix(filePath, fileName))
        }
        if (stat.isFile() && extname(filePath) === fileName) {
            files.push(filePath)
        }
    }
    return files
}

/**
 * 删除目录和内部文件
 * */
export function delDir(path: string): void {
    if (path.substr(0, 1) !== "/") path = resolve(path);
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file) => {
            let curPath = path + "/" + file;
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
    if (path.substr(0, 1) !== "/") path = resolve(path);
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
    if (path.substr(0, 1) !== "/") path = resolve(path);
    return new Promise((resolve) =>
        fs.readFile(
            path,
            options,
            (err, data) => {
                if (err) resolve(0);
                resolve(data);
            })
    )
}

/**
 * 逐行读取
 * @param path
 * @param index
 */
export function readLine(path: string, index?: number): Promise<string | any[]> | null {
    if (path.substr(0, 1) !== "/") path = resolve(path);
    const io = createInterface({
        input: fs.createReadStream(path)
    })
    switch (index) {
        case -1:
            return new Promise((resolve) => {
                io.on('line', (line) => {
                    line = line.replace(/(^\s*)|(\s*$)/g, "");
                    io.close();
                    if (isNull(line)) line = null;
                    resolve(line);
                });
            });
        default:
            return new Promise((resolve) => {
                let indes = 0;
                let data: any[] = [];
                io.on('line', (line) => {
                    indes++;
                    if (index && indes === index) io.close();
                    try {
                        line = line.replace(/(^\s*)|(\s*$)/g, "");
                        if (!isNull(line)) data.push(line);
                    } catch (e) {
                        Log.error(e);
                    }
                });
                io.on('close', () => resolve(data));
            })
    }
}


/**
 * 覆盖数据到文件
 * @return 0 失败 1 成功
 */
export async function writeFile(path: string, data: string | Buffer, options?: { encoding?: BufferEncoding; mode?: number | string; flag?: string; }) {
    console.log(data)
    if (path.substr(0, 1) !== "/") path = resolve(path);
    if (await access(path) === 0) fs.mkdirSync(dirname(path), {recursive: true});
    return new Promise((resolve) =>
        fs.writeFile(path, data, options, (err) => {
            if (err) {
                Log.error(err);
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
    if (path.substr(0, 1) !== "/") path = resolve(path);
    if (await access(path) === 0) fs.mkdirSync(dirname(path), {recursive: true});
    return new Promise((resolve) =>
        fs.appendFile(path, data, options, (err) => {
            if (err) {
                Log.error(err);
                resolve(0);
            }
            resolve(1);
        })
    );
}