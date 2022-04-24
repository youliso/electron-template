import { appInstance, windowInstance, Tray, Session, Update, logError } from 'ym-electron/main';
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

    windowInstance.create(customize, opt);
    tary.create(logo);
  })
  .catch(logError);
