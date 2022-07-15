import { appInstance } from '@youliso/electron-modules/main/app';
import { windowInstance } from '@youliso/electron-modules/main/window';
import { Session } from '@youliso/electron-modules/main/session';
import { Tray } from '@youliso/electron-modules/main/tray';
import { Update } from '@youliso/electron-modules/main/update';
import { logError } from '@youliso/electron-modules/main/log';
import { app } from 'electron';
import { customize, opt } from '@/cfg/window.json';
import updateCfg from '@/cfg/update.json';
import logo from '@/assets/icon/logo.png';

appInstance
  .start()
  .then(() => {
    const tary = new Tray();
    const update = new Update(
      { provider: updateCfg.provider as any, url: updateCfg.url },
      'resources/build/cfg/app-update.yml',
      updateCfg.dirname
    );
    const session = new Session();

    tary.on();
    update.on();
    session.on();

    // 调试模式
    if (!app.isPackaged) {
      try {
        import('fs').then(({ readFileSync }) => {
          import('path').then(({ join }) => {
            windowInstance.defaultUrl = `http://localhost:${readFileSync(join('.port'), 'utf8')}`;
            windowInstance.create(customize, opt);
          });
        });
      } catch (e) {
        throw 'not found .port';
      }
    } else windowInstance.create(customize, opt);

    tary.create(logo);
  })
  .catch(logError);
