import { preload } from '@youliso/electronic/render';

export const getCacheSize = () => preload.invoke<number>('session-get-cache');

export const clearCache = () => preload.invoke<void>('session-clear-cache');
