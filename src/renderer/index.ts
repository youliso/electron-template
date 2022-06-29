import { windowLoad } from '@youliso/electron-modules/renderer/window';
import { globalComponent } from '@youliso/web-modules';
import '@/renderer/views/style';

windowLoad((_, args) => {
  window.customize = args;
  !window.customize.headNative && globalComponent.use(import('./views/components/head'), 'head');
  import('@/renderer/router').then((router) =>
    router.default.push(window.customize.route as string)
  );
});
