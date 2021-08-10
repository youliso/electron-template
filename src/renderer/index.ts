import customize from '@/renderer/store/customize';
import app from '@/renderer/views/app';
import { windowLoad } from '@/renderer/utils/window';
import { domPropertyLoad } from '@/renderer/utils/dom';

windowLoad((_, args) => {
  customize.set(args);
  domPropertyLoad();
  app();
});
