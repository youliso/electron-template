import { windowLoad } from '@youliso/electron-modules/renderer/window';
import '@/renderer/views/style';
windowLoad((_, args) => {
  window.customize = args;
  import('@/renderer/router').then((router) => {
    router.default.mount('root', window.customize.route as string);
  });
});
