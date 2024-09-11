import { windowLoad, windowShow, windowSingleInstanceOn } from '@youliso/electronic/ipc/window';

windowLoad(() => {
  console.log('customize', window.customize);
  console.log('env', process.env);
  windowSingleInstanceOn((argv) => {
    console.log(argv);
  });
  document.getElementById('root')!.innerHTML = 'hello word';
  windowShow();
});
