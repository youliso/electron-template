import {existsSync, readdirSync, rmdirSync, statSync, unlinkSync} from "fs";

/**
 * 删除目录和内部文件
 * */
export function delDir(path: string) {
    let files = [];
    if (existsSync(path)) {
        files = readdirSync(path);
        files.forEach((file) => {
            let curPath = path + "/" + file;
            if (statSync(curPath).isDirectory()) {
                this.delDir(curPath); //递归删除文件夹
            } else {
                unlinkSync(curPath); //删除文件
            }
        });
        rmdirSync(path);
    }
}