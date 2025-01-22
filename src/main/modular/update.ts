import { Update } from '@youliso/electronic/main';
import { app } from 'electron';
import { join } from 'node:path';
export const updateOn = () => {
  // 更新部分(win)
  const update = new Update(
    {
      provider: process.env.UPDATEPROVIDER as any,
      url: process.env.UPDATEURL
    },
    process.env.UPDATEDIRNAME,
    join(__dirname, '../.update.yml'),
    console
  );
  // 开启调试更新
  update.autoUpdater.forceDevUpdateConfig = !app.isPackaged;
  update.on();
};
