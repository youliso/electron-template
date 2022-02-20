import { windowLoad } from '@/renderer/common/window';
import { setCustomize } from '@/renderer/store';
import GlobalComponent from '@/renderer/common/globalComponent';
import '@/renderer/views/style';
windowLoad((_, args) => {
  setCustomize(args);
  document.title = args.title || '';
  !args.headNative && GlobalComponent.use(import('./views/components/head'), 'head');
  import('@/renderer/router').then((router) => router.default.push(args.route as string));
});
