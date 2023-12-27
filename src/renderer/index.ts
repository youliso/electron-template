import { windowLoad } from '@youliso/electronic/ipc/window';
import { createApp } from 'vue';
import head from './views/components/head.vue';
import app from './views/app.vue';
import router from './router';

windowLoad((_, args) => {
  window.customize = args;
  router.addRoute({
    path: '/',
    redirect: args.route as string
  });
  createApp(app).use(router).component('Head', head).mount('#root');
});
