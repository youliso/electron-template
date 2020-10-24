import {createApp} from "vue";
import App from "./App.vue";
import {argsSymbol, createArgs} from "./store";
import router from "./router";
import {Init} from "./utils/ipc";

Init().then((Args: WindowOpt) => {
    createApp(App)
        .use(router)
        .provide(argsSymbol, createArgs(Args))
        .mount("#app");
});
