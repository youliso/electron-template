import preload from '@youliso/electronic/preload';

export const resourcesPathGet = (
  type: 'platform' | 'inside' | 'extern' | 'root',
  path: string = './'
) => preload.invoke<string>('resources-path-get', { type, path });
