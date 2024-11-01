import { Update } from '@youliso/electronic/main';
import { app } from 'electron';
import { join } from 'node:path';

const updateServer = {
  provider: 'generic',
  url: 'http://192.168.3.149:80/images/im_pc_update'
};

export const updateOn = () => {
  // 更新部分(win)
  const update = new Update(
    {
      provider: updateServer.provider as any,
      url: updateServer.url
    },
    process.env.UPDATEDIRNAME,
    join(__dirname, '../scripts/.update.yml'),
    console
  );
  // 开启调试更新
  update.autoUpdater.forceDevUpdateConfig = !app.isPackaged;
  update.on();
};
