import { windowLoad } from '@/renderer/common/window';
import GlobalComponent from '@/renderer/common/globalComponent';
import '@/renderer/views/style';
windowLoad((_, args) => {
  window.customize = args;
  document.title = window.customize.title || '';
  !window.customize.headNative && GlobalComponent.use(import('./views/components/head'), 'head');
  import('@/renderer/router').then((router) =>
    router.default.push(window.customize.route as string)
  );
});
