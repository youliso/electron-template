import { windowLoad, windowShow, windowSingleInstanceOn } from '@youliso/electronic/ipc';

windowLoad(() => {
  console.log('customize', window.customize);
  console.log('env', process.env);
  windowSingleInstanceOn((argv) => {
    console.log(argv);
  });
  const rootDom = document.getElementById('root');
  const customizeDom = document.createElement('div');
  const envDom = document.createElement('div');
  customizeDom.style.wordBreak = 'break-word';
  customizeDom.innerText = JSON.stringify(window.customize);
  envDom.style.wordBreak = 'break-word';
  envDom.innerText = JSON.stringify(process.env);
  rootDom?.appendChild(document.createTextNode('env'));
  rootDom?.appendChild(envDom);
  rootDom?.appendChild(document.createTextNode('customize'));
  rootDom?.appendChild(customizeDom);
  rootDom?.appendChild(document.createTextNode('hello word'));
  windowShow();
});
