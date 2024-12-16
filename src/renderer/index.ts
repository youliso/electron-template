import {
  preload,
  windowLoad,
  windowShow,
  windowSingleInstanceOn
} from '@youliso/electronic/render';
import { resourcesPathGet } from './common/resources';

preload.initialize();

windowLoad(() => {
  console.log('customize', window.customize);
  windowSingleInstanceOn((argv) => {
    console.log(argv);
  });
  const rootDom = document.getElementById('root');
  const customizeDom = document.createElement('div');
  customizeDom.style.wordBreak = 'break-word';
  customizeDom.innerText = JSON.stringify(window.customize);
  rootDom?.appendChild(document.createTextNode('customize'));
  rootDom?.appendChild(customizeDom);
  rootDom?.appendChild(document.createTextNode('hello word'));
  resourcesPathGet('platform', 't.txt').then((res) => {
    rootDom?.appendChild(document.createTextNode(`platform: ` + res));
  });
  resourcesPathGet('inside', 't.txt').then((res) => {
    rootDom?.appendChild(document.createTextNode(`inside: ` + res));
  });
  resourcesPathGet('extern', 't.txt').then((res) => {
    rootDom?.appendChild(document.createTextNode(`extern: ` + res));
  });
  resourcesPathGet('root', 't.txt').then((res) => {
    rootDom?.appendChild(document.createTextNode(`root: ` + res));
  });
  windowShow();
});
