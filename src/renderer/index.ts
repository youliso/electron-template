import { windowLoad, windowShow } from '@youliso/electronic/ipc/window';

windowLoad(() => {
  document.getElementById('root')!.innerHTML = 'hello word';
  windowShow();
});
