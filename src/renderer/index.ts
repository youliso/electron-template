import { windowLoad } from 'ym-electron/renderer/window';
import { globalComponent } from 'ym-web';
import '@/renderer/views/style';

windowLoad((_, args) => {
  window.customize = args;
  !window.customize.headNative && globalComponent.use(import('./views/components/head'), 'head');
  import('@/renderer/router').then((router) =>
    router.default.push(window.customize.route as string)
  );
});
