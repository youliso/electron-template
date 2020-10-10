import {createApp} from 'vue';
import App from './App.vue';
import {appRoutes, dialogRoutes} from './router';
import store from './store';
import Ipc from './utils/ipc';

Ipc.Init().then((Args: { [key: string]: unknown }) => {
    // @ts-ignore
    const app = createApp(App);
    app.config.globalProperties.$Args = Args['data'] || null;
    switch (Args['el']) {
        case 'app':
            app.use(appRoutes).use(store).mount('#app');
            break;
        case 'dialog':
            app.use(dialogRoutes).use(store).mount('#app');
            break;
    }
});