import { windowLoad } from '@youliso/electronic/ipc';
import '@/renderer/views/style';

windowLoad((_, args) => {
  window.customize = args;
  import('@/renderer/router').then((router) => {
    router.default.mount('root', window.customize.route as string);
  });
});
