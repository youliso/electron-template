import { preload } from '@youliso/electronic/render';

export const resourcesPathGet = (
  type: 'platform' | 'inside' | 'extern' | 'root',
  path: string = './',
  is_arch: boolean = true
) => preload.invoke<string>('resources-path-get', { type, path, is_arch });
