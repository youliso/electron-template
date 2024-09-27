import preload from '@youliso/electronic/preload';

export const getCacheSize = () => preload.invoke<number>('session-get-cache');

export const clearCache = () => preload.invoke<void>('session-clear-cache');
