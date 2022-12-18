import { appInstance } from '@youliso/electronic/app';
import { windowInstance } from '@youliso/electronic/window';
import { Session } from '@youliso/electronic/session';
import { Tray } from '@youliso/electronic/tray';
import { Update } from '@youliso/electronic/update';
import { logError } from '@youliso/electronic/log';
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
