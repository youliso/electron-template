import { windowLoad } from '@/renderer/utils/window';
import { domPropertyLoad } from '@/renderer/utils/dom';
import app from '@/renderer/views';
import Store from '@/renderer/store';
import Dom from '@/renderer/utils/dom';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

windowLoad((_, args) => {
  domPropertyLoad();
  Store.set('customize', args);
  Dom.init('app', 'container');
  app();
});
