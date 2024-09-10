import { windowLoad, windowShow } from '@youliso/electronic/ipc/window';

windowLoad(() => {
  console.log('customize', window.customize);
  console.log('env', process.env);
  document.getElementById('root')!.innerHTML = 'hello word';
  windowShow();
});
