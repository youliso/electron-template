import {BrowserWindow, ipcMain} from "electron";
import {join} from "path";
import {autoUpdater} from "electron-updater";
import Log from "../lib/log";
import {delDir} from "../lib";

const config = require("../lib/cfg/config.json");

/**
 * 更新模块
 * */
export class Update {
    handleUpdate() {
        // @ts-ignore
        const updatePendingPath = join(autoUpdater.app.baseCachePath, config.updaterCacheDirName, 'pending');
        delDir(updatePendingPath);
    }

    constructor(winId: number) {
        autoUpdater.removeAllListeners();
        this.handleUpdate();
        let win = BrowserWindow.fromId(winId);
        let message = {
            error: {code: 0, msg: "检查更新出错"},
            checking: {code: 1, msg: "正在检查更新"},
            updateAva: {code: 2, msg: "检测到新版本，正在下载"},
            updateNotAva: {code: 3, msg: "现在使用的就是最新版本，不用更新"}
        };
        // 本地开发环境，改变app-update.yml地址
        if (process.env.NODE_ENV === 'development' && !(process.platform === 'darwin')) {
            autoUpdater.updateConfigPath = join(__dirname, 'out/win-unpacked/resources/app-update.yml')
        }
        // 这里的URL就是更新服务器的放置文件的地址
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: config.updateFileUrl
        });
        autoUpdater.on("error", () => {
            win.webContents.send("update-message", message.error);
        });
        autoUpdater.on("checking-for-update", () => {
            win.webContents.send("update-message", message.checking);
        });
        autoUpdater.on("update-available", () => {
            win.webContents.send("update-message", message.updateAva);
        });
        autoUpdater.on("update-not-available", () => {
            win.webContents.send("update-message", message.updateNotAva);
        });
        // 更新下载进度事件
        autoUpdater.on("download-progress", (progressObj) => {
            win.webContents.send("download-progress", progressObj)
        })
        // 下载完成事件
        autoUpdater.on("update-downloaded", () => {
            ipcMain.on("update-downloaded", () => {
                // 关闭程序安装新的软件
                autoUpdater.quitAndInstall(true);
            });
            // 通知渲染进程现在完成
            win.webContents.send("update-downloaded");
        });
        autoUpdater.checkForUpdates().catch(e => Log.error(e));
    }
}