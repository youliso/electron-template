import { windowLoad } from '@/renderer/common/window';
import { setCustomize } from '@/renderer/store';
import GlobalComponent from '@/renderer/common/globalComponent';
import '@/renderer/views/scss/color.scss';
import '@/renderer/views/scss/index.scss';

windowLoad(async (_, args) => {
  setCustomize(args);
  if (args.title) document.title = args.title;
  document.body.setAttribute('platform', window.environment.platform);
  document.body.setAttribute('headNative', args.headNative + '' || 'false');
  !args.headNative &&
    GlobalComponent.use(import('./views/components/head'), 'head').then(() =>
      import('@/renderer/router').then(({ routerInit }) => routerInit(args.route as string))
    );
  import('@/renderer/router').then(({ routerInit }) => routerInit(args.route as string));
});
