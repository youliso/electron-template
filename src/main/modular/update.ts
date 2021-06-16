import { join } from 'path';
import { AppUpdater, autoUpdater } from 'electron-updater';
import { delDir } from '@/main/modular/file';
import { ipcMain } from 'electron';
import Window from '@/main/modular/window';

const { updaterCacheDirName, updateFileUrl } = require('@/cfg/index.json');

/**
 * 更新模块 https://www.electron.build/auto-update
 * */
export class Update {
  public autoUpdater: AppUpdater = autoUpdater;

  constructor() {
  }

  /**
   * 删除更新包文件
   */
  handleUpdate() {
    const updatePendingPath = join(
      // @ts-ignore
      this.autoUpdater.app.baseCachePath,
      updaterCacheDirName,
      'pending'
    );
    try {
      delDir(updatePendingPath);
    } catch (e) {
    }
  }

  /**
   * 检查更新
   * @param messageBack 反馈更新状态
   */
  open(messageBack: Function) {
    let message = {
      error: { code: 0, msg: '检查更新出错' },
      checking: { code: 1, msg: '正在检查更新' },
      updateAva: { code: 2, msg: '检测到新版本,正在下载' },
      updateDown: { code: 3, value: '', msg: '下载中' },
      updateDownload: { code: 4, msg: '已下载完毕' },
      updateNotAva: { code: 5, msg: '现在使用的就是最新版本,不用更新' }
    };
    //本地开发环境，使用调试app-update.yml地址
    if (process.env.NODE_ENV === 'development' && !(process.platform === 'darwin')) {
      this.autoUpdater.updateConfigPath = join('build/cfg/app-update.yml');
    }
    // 这里的URL就是更新服务器的放置文件的地址
    this.autoUpdater.setFeedURL({
      provider: 'generic',
      url: updateFileUrl
    });
    this.autoUpdater.on('error', () => messageBack(message.error));
    this.autoUpdater.on('checking-for-update', () => messageBack(message.checking));
    this.autoUpdater.on('update-available', () => messageBack(message.updateAva));
    this.autoUpdater.on('update-not-available', () => messageBack(message.updateNotAva));
    // 更新下载进度事件
    this.autoUpdater.on('download-progress', (progressObj) => {
      message.updateDown.value = progressObj;
      messageBack(message.updateDown);
    });
    // 下载完成事件
    this.autoUpdater.on('update-downloaded', () => messageBack(message.updateDownload));
  }

  /**
   * 检查更新
   * @param isDel 是否删除历史更新缓存
   * @param autoDownload 是否在找到更新时自动下载更新
   */
  checkUpdate(isDel: boolean, autoDownload: boolean = false) {
    if (isDel) this.handleUpdate();
    this.autoUpdater.autoDownload = autoDownload;
    this.autoUpdater.checkForUpdates().catch();
  }

  /**
   * 关闭程序进行更新
   * @param isSilent 是否静默更新
   */
  updateQuitInstall(isSilent: boolean = false) {
    this.autoUpdater.quitAndInstall(isSilent);
  }

  /**
   * 开启监听
   */
  on() {
    //开启更新监听
    ipcMain.on('update-back-open', () => {
      this.open((data: { key: string; value: any }) => Window.windowSend('update-back', data));
    });
    //检查更新
    ipcMain.on('update-check', (event, args) => this.checkUpdate(args.isDel, args.autoDownload));
    // 关闭程序安装新的软件 isSilent 是否静默更新
    ipcMain.on('update-quit-install', (event, isSilent) => this.updateQuitInstall(isSilent));
  }
}
