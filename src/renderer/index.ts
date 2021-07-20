import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { windowLoad } from './utils/window';

windowLoad().then(() => createApp(App).use(router).mount('#app'));
