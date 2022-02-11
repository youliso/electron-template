import type { AllPublishOptions } from 'builder-util-runtime';
import type { AppUpdater } from 'electron-updater';
import { join } from 'path';
import { AppImageUpdater, MacUpdater, NsisUpdater } from 'electron-updater';
import { delDir } from '@/main/modular/file';
import { ipcMain, app } from 'electron';
import Window from '@/main/modular/window';
import { logError } from '@/main/modular/log';
import updateCfg from '@/cfg/update.json';

/**
 * 更新模块 https://www.electron.build/auto-update
 * */
export default class Update {
  public autoUpdater: AppUpdater;

  constructor() {
    const options: AllPublishOptions = {
      // @ts-ignore
      provider: updateCfg.provider,
      url: updateCfg.url
    };
    if (process.platform === 'win32') this.autoUpdater = new NsisUpdater(options);
    else if (process.platform === 'darwin') this.autoUpdater = new MacUpdater(options);
    else this.autoUpdater = new AppImageUpdater(options);
    //本地开发环境，使用调试app-update.yml地址
    if (!app.isPackaged && !(process.platform === 'darwin')) {
      this.autoUpdater.updateConfigPath = join('resources/build/cfg/app-update.yml');
    }
  }

  /**
   * 删除更新包文件
   */
  handleUpdate() {
    const updatePendingPath = join(
      // @ts-ignore
      this.autoUpdater.app.baseCachePath,
      updateCfg.dirname,
      'pending'
    );
    try {
      delDir(updatePendingPath);
    } catch (e) {}
  }

  /**
   * 检查更新
   */
  open(callback: Function) {
    const message: { [key: string]: UpdateMessage } = {
      error: { code: 0, msg: '检查更新出错' },
      checking: { code: 1, msg: '正在检查更新' },
      updateAva: { code: 2, msg: '检测到新版本' },
      updateDown: { code: 3, msg: '下载中' },
      updateDownload: { code: 4, msg: '下载完成' },
      updateNotAva: { code: 5, msg: '当前为最新版本' }
    };
    this.autoUpdater.on('error', () => callback(message.error));
    this.autoUpdater.on('checking-for-update', () => callback(message.checking));
    this.autoUpdater.on('update-available', () => callback(message.updateAva));
    this.autoUpdater.on('update-not-available', () => callback(message.updateNotAva));
    // 更新下载进度事件
    this.autoUpdater.on('download-progress', (progressObj) => {
      message.updateDown.value = progressObj;
      callback(message.updateDown);
    });
    // 下载完成事件
    this.autoUpdater.on('update-downloaded', () => callback(message.updateDownload));
  }

  /**
   * 检查更新
   * @param isDel 是否删除历史更新缓存
   * @param autoDownload 是否在找到更新时自动下载更新
   */
  checkUpdate(isDel: boolean, autoDownload: boolean = false) {
    if (isDel) this.handleUpdate();
    this.autoUpdater.autoDownload = autoDownload;
    this.autoUpdater.checkForUpdates().catch(logError);
  }

  /**
   * 下载更新 (如果autoDownload选项设置为 false，则可以使用此方法
   */
  downloadUpdate() {
    this.autoUpdater.downloadUpdate().catch(logError); //TODO待完善
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
    this.open((data: { key: string; value: any }) => Window.send('update-back', data));
    //检查更新
    ipcMain.on('update-check', (event, args) => this.checkUpdate(args.isDel, args.autoDownload));
    //手动下载更新
    ipcMain.on('update-download', (event, args) => this.downloadUpdate());
    // 关闭程序安装新的软件 isSilent 是否静默更新
    ipcMain.on('update-install', (event, isSilent) => this.updateQuitInstall(isSilent));
  }
}
