import { windowLoad } from '@youliso/electronic/ipc/window';
import { createApp } from 'vue';
import app from './views/app.vue';
import router from './router';

windowLoad(() => {
  router.addRoute({
    path: '/',
    redirect: window.customize.route as string
  });
  createApp(app).use(router).mount('#root');
});
