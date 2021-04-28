import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { argsData } from './store';
import { windowLoad } from './utils/window';

windowLoad().then(args => {
  argsData.window = args;
  createApp(App)
    .use(router)
    .mount('#app');
});
