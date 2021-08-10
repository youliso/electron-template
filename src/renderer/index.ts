import customize from '@/renderer/store/customize';
import app from '@/renderer/views/app';
import { windowLoad } from '@/renderer/utils/window';
import { domPropertyLoad } from '@/renderer/utils/dom';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

windowLoad((_, args) => {
  customize.set(args);
  domPropertyLoad();
  app('app');
});
