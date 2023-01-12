import { appInstance, windowInstance, Session, createTray, Update, logError } from '@youliso/electronic';
import { app } from 'electron';
import { customize, opt } from '@/cfg/window.json';
import updateCfg from '@/cfg/update.json';
import logo from '@/assets/icon/logo.png';

appInstance
  .start()
  .then(() => {
    const tray = createTray({
      name: customize.title,
      iconPath: logo as string
    });
    const update = new Update(
      { provider: updateCfg.provider as any, url: updateCfg.url },
      'resources/build/cfg/app-update.yml',
      updateCfg.dirname
    );
    const session = new Session();

    update.on();
    session.on();

    // 调试模式
    if (!app.isPackaged) {
      try {
        import('fs').then(({ readFileSync }) => {
          import('path').then(({ join }) => {
            windowInstance.defaultUrl = `http://localhost:${readFileSync(join('.port'), 'utf8')}`;
            windowInstance.create(customize, opt).catch(console.error);
          });
        });
      } catch (e) {
        throw 'not found .port';
      }
    } else windowInstance.create(customize, opt).catch(logError);
  })
  .catch(logError);
