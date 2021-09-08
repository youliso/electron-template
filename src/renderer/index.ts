import { windowLoad } from '@/renderer/common/window';
import { domPropertyLoad } from '@/renderer/common/dom';
import Store from '@/renderer/store';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

windowLoad(async (_, args) => {
  domPropertyLoad();
  Store.set('customize', args);
  import('@/renderer/views/index').then((app) => app.default());
});
