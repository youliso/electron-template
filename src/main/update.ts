import {join} from "path";
import {AppUpdater, autoUpdater} from "electron-updater";
import Log from "@/lib/log";
import {delDir} from "@/lib";

const config = require("@/lib/cfg/config.json");

/**
 * 更新模块
 * */
export class Updates {
    public autoUpdater: AppUpdater;

    constructor() {
        this.autoUpdater = autoUpdater;
    }

    /**
     * 删除更新包文件
     */
    handleUpdate() {
        // @ts-ignore
        const updatePendingPath = join(this.autoUpdater.app.baseCachePath, config.updaterCacheDirName, 'pending');
        delDir(updatePendingPath);
    }

    /**
     * 检查更新
     * @param messageBack 反馈更新状态
     */
    checkForUpdates(messageBack: Function) {
        this.autoUpdater.removeAllListeners();
        this.handleUpdate();
        let message = {
            error: {key: "update-message", value: {code: 0, msg: "检查更新出错"}},
            checking: {key: "update-message", value: {code: 1, msg: "正在检查更新"}},
            updateAva: {key: "update-message", value: {code: 2, msg: "检测到新版本,正在下载"}},
            updateNotAva: {key: "update-message", value: {code: 3, msg: "现在使用的就是最新版本,不用更新"}}
        };
        // 本地开发环境，改变app-update.yml地址
        if (process.env.NODE_ENV === 'development' && !(process.platform === 'darwin')) {
            this.autoUpdater.updateConfigPath = join(__dirname, 'out/win-unpacked/resources/app-update.yml')
        }
        // 这里的URL就是更新服务器的放置文件的地址
        this.autoUpdater.setFeedURL({
            provider: 'generic',
            url: config.updateFileUrl
        });
        this.autoUpdater.on("error", () => messageBack(message.error));
        this.autoUpdater.on("checking-for-update", () => messageBack(message.checking));
        this.autoUpdater.on("update-available", () => messageBack(message.updateAva));
        this.autoUpdater.on("update-not-available", () => messageBack(message.updateNotAva));
        // 更新下载进度事件
        this.autoUpdater.on("download-progress", (progressObj) => messageBack({
            key: "update-download",
            value: progressObj
        }));
        // 下载完成事件
        this.autoUpdater.on("update-downloaded", () => messageBack({key: "update-download", value: "downloaded"}));
        this.autoUpdater.checkForUpdates().catch(e => Log.error(e));
    }

    /**
     * 重新检查
     * @param isDel 是否删除历史更新缓存
     */
    checkUpdate(isDel: boolean) {
        if (isDel) this.handleUpdate();
        this.autoUpdater.checkForUpdates().catch(e => Log.error(e));
    }

    /**
     * 关闭程序进行更新
     * @param isSilent 是否静默更新
     */
    updateQuitInstall(isSilent: boolean) {
        this.autoUpdater.quitAndInstall(isSilent);
    }

}
