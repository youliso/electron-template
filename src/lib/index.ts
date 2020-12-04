import {existsSync, readdirSync, rmdirSync, statSync, unlinkSync} from "fs";
import {resolve} from "path";
import {remote} from "electron";

/**
 * 删除目录和内部文件
 * */
export function delDir(path: string): void {
    let files = [];
    if (existsSync(path)) {
        files = readdirSync(path);
        files.forEach((file) => {
            let curPath = path + "/" + file;
            if (statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                unlinkSync(curPath); //删除文件
            }
        });
        rmdirSync(path);
    }
}

/**
 * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
 * @param path lib/inside为起点的相对路径
 * */
export function getInsidePath(path: string): string {
    return remote.app.isPackaged ? resolve(__dirname, '../inside/' + path) : resolve('./src/lib/inside/' + path);
}

/**
 * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
 * @param path lib/extern为起点的相对路径
 * */
export function getExternPath(path: string): string {
    return remote.app.isPackaged ? resolve(__dirname, '../../extern/' + path) : resolve('./src/lib/extern/' + path);
}