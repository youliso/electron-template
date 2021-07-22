import { createApp } from 'vue';
import { argsData } from '@/renderer/store';
import { windowLoad } from '@/renderer/utils/window';
import { domPropertyLoad } from '@/renderer/utils/dom';
import App from '@/renderer/views/index.vue';
import router from '@/renderer/router';

windowLoad((_, args) => {
  argsData.window = args;
  router.addRoute({
    path: '/',
    redirect: argsData.window.route
  });
  domPropertyLoad();
  createApp(App).use(router).mount('#app');
});
