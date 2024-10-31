import { preload } from '@youliso/electronic/render';

export const resourcesPathGet = (
  type: 'platform' | 'inside' | 'extern' | 'root',
  path: string = './'
) => preload.invoke<string>('resources-path-get', { type, path });
