import { windowLoad } from '@/renderer/common/window';
import { domPropertyLoad } from '@/renderer/common/dom';
import { setCustomize } from '@/renderer/store';
import { routerInit } from '@/renderer/router';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

windowLoad((_, args) => {
  domPropertyLoad();
  setCustomize(args);
  routerInit(args.route);
});
