import type { AllPublishOptions } from 'builder-util-runtime';
import type { AppUpdater, Logger } from 'electron-updater';
import { join } from 'path';
import { AppImageUpdater, MacUpdater, NsisUpdater } from 'electron-updater';
import { app } from 'electron';
import { preload } from '@youliso/electronic/main';

/**
 * 更新模块 https://www.electron.build/auto-update
 * */
class Update {
  public autoUpdater: AppUpdater;

  public options: AllPublishOptions;

  constructor(options: AllPublishOptions, defaultConfigPath?: string, logger?: Logger) {
    this.options = options;
    if (process.platform === 'win32') this.autoUpdater = new NsisUpdater(this.options);
    else if (process.platform === 'darwin') this.autoUpdater = new MacUpdater(this.options);
    else this.autoUpdater = new AppImageUpdater(this.options);
    // 本地开发环境，使用调试app-update.yml地址
    if (defaultConfigPath && !app.isPackaged) {
      // 开启调试更新
      this.autoUpdater.forceDevUpdateConfig = true;
      this.autoUpdater.updateConfigPath = join(defaultConfigPath);
    }
    logger && (this.autoUpdater.logger = logger);
  }

  /**
   * 检查更新
   */
  open(callback: Function) {
    this.autoUpdater.on('error', (error) =>
      callback({
        code: 0,
        data: error
      })
    );
    this.autoUpdater.on('checking-for-update', () =>
      callback({
        code: 1
      })
    );
    this.autoUpdater.on('update-available', (data) =>
      callback({
        code: 2,
        data
      })
    );
    this.autoUpdater.on('update-not-available', (data) =>
      callback({
        code: 5,
        data
      })
    );
    // 更新下载进度事件
    this.autoUpdater.on('download-progress', (data) =>
      callback({
        code: 3,
        data
      })
    );
    // 下载完成事件
    this.autoUpdater.on('update-downloaded', (data) =>
      callback({
        code: 4,
        data
      })
    );
  }

  /**
   * 检查更新
   * @param autoDownload 是否在找到更新时自动下载更新
   * @param url 更新地址（不传用默认地址）
   */
  checkUpdate(autoDownload: boolean = false, url?: string) {
    url && this.autoUpdater.setFeedURL(url);
    this.autoUpdater.autoDownload = autoDownload;
    return this.autoUpdater.checkForUpdates();
  }

  /**
   * 下载更新 (如果autoDownload选项设置为 false，则可以使用此方法
   */
  downloadUpdate() {
    return this.autoUpdater.downloadUpdate(); //TODO待完善
  }

  /**
   * 关闭程序进行更新
   * @param isSilent 是否静默更新
   */
  updateQuitInstall(isSilent: boolean = false) {
    this.autoUpdater.quitAndInstall(isSilent);
    if (process.platform === 'darwin') {
      //TODO mac下自动更新后，没自动退出
      setTimeout(() => {
        app.quit();
      }, 300);
    }
  }

  /**
   * 开启监听
   */
  on() {
    //开启更新监听
    this.open((data: { key: string; value: any }) => preload.send('update-back', data));
    //检查更新
    preload.handle('update-check', (_, args) => this.checkUpdate(args.autoDownload, args.url));
    //手动下载更新
    preload.handle('update-download', () => this.downloadUpdate());
    // 关闭程序安装新的软件 isSilent 是否静默更新
    preload.on<boolean>('update-install', (_, isSilent) => this.updateQuitInstall(isSilent));
  }
}

export const updateOn = () => {
  // 更新部分(win)
  const update = new Update(
    {
      provider: process.env.UPDATEPROVIDER as any,
      url: process.env.UPDATEURL
    },
    join(__dirname, '../.update.yml'),
    console
  );
  // 开启调试更新
  update.autoUpdater.forceDevUpdateConfig = !app.isPackaged;
  update.on();
};
