import { windowLoad } from '@youliso/electronic/ipc/window';
import { createApp } from 'vue';
import app from './views/app.vue';
import router from './router';

windowLoad((args) => {
  window.customize = args;
  router.addRoute({
    path: '/',
    redirect: args.route as string
  });
  createApp(app).use(router).mount('#root');
});
