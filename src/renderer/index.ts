import { windowLoad } from '@/renderer/common/window';
import { setCustomize } from '@/renderer/store';
import { routerInit } from '@/renderer/router';
import GlobalComponent from './common/globalComponent';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

windowLoad((_, args) => {
  document.body.setAttribute('platform', window.environment.platform);
  setCustomize(args);
  GlobalComponent.use(import('./views/components/head'), 'head');
  routerInit(args.route as string);
});
