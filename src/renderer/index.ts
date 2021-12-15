import { windowLoad } from '@/renderer/common/window';
import { setCustomize } from '@/renderer/store';
import { routerInit } from '@/renderer/router';
import GlobalComponent from './common/globalComponent';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

windowLoad(async (_, args) => {
  document.body.setAttribute('platform', window.environment.platform);
  setCustomize(args);
  const Head = await import('./views/components/head');
  GlobalComponent.render('Head', new Head.default());
  routerInit(args.route as string);
});
