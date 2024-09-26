import { app } from 'electron';
import { accessSync, constants } from 'fs';
import { resolve, join, normalize } from 'path';
import preload from '@youliso/electronic/preload';

/**
 * 获取资源文件路径
 * 不传path返回此根目录
 * 断言通过返回绝对路径 (inside 存在虚拟路径不做断言)
 * */
export function resourcesPathGet(
  type: 'platform' | 'inside' | 'extern' | 'root',
  path: string = './'
): string {
  try {
    switch (type) {
      case 'platform':
        path = normalize(
          app.isPackaged
            ? resolve(join(__dirname, '..', 'platform', process.platform, path))
            : resolve(join('resources', 'platform', process.platform, path))
        );
        break;
      case 'inside':
        return (path = normalize(
          app.isPackaged
            ? resolve(join(__dirname, 'inside', path))
            : resolve(join('resources', 'inside', path))
        ));
      case 'extern':
        path = normalize(
          app.isPackaged
            ? resolve(join(__dirname, '..', 'extern', path))
            : resolve(join('resources', 'extern', path))
        );
        break;
      case 'root':
        path = normalize(
          app.isPackaged
            ? resolve(join(__dirname, '..', '..', path))
            : resolve(join('resources', 'root', path))
        );
        break;
    }
    accessSync(path, constants.R_OK);
    return path;
  } catch (err) {
    throw err;
  }
}

/**
 * 监听
 */
export function resourcesOn() {
  //获取依赖路径
  preload.handle('resources-path-get', ({event,args}) => {
    return resourcesPathGet(args.type, args.path);
  });
}
