import type {
  UpdateCheckResult,
  UpdateInfo,
  ProgressInfo,
  UpdateDownloadedEvent
} from 'electron-updater';
import { preload } from '@youliso/electronic/render';

/**
 * 更新监听
 */
export function updateOn(
  listener: (args: {
    code: number;
    data: Error | UpdateInfo | ProgressInfo | UpdateDownloadedEvent;
  }) => void
) {
  preload.on('update-back', listener);
}

/**
 * 关闭监听
 */
export function updateListenersRemove() {
  preload.removeOn('update-back');
}

/**
 * 检查更新
 * @param isDel 是否删除历史更新缓存
 * @param autoDownload 是否在找到更新时自动下载更新
 * @param url 更新地址（不传用默认地址）
 */
export function updateCheck(autoDownload: boolean = false, url?: string) {
  return preload.invoke<UpdateCheckResult | null>('update-check', {
    autoDownload,
    url
  });
}

/**
 * 下载更新 (如果autoDownload选项设置为 false，则可以使用此方法
 */
export function updateDownload() {
  return preload.invoke<string[]>('update-download');
}

/**
 * 关闭程序进行更新
 * @param isSilent 是否静默更新
 */
export function updateInstall(isSilent: boolean) {
  preload.send('update-install', isSilent);
}
