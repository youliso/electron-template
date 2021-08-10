import Store from '@/renderer/store';
import app from '@/renderer/views/app';
import { windowLoad } from '@/renderer/utils/window';
import { domPropertyLoad } from '@/renderer/utils/dom';

windowLoad((_, args) => {
  Store.sharedObject['window'] = args;
  domPropertyLoad();
  app();
});
