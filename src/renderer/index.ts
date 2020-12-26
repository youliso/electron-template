import {createApp} from "vue";
import App from "./App.vue";
import {argsSymbol, createArgs} from "./store";
import router from "./router";
import {windowLoad, messageBack} from "./utils/ipc";

(async () => {
    messageBack();
    const Args = await windowLoad();
    createApp(App as any)
        .use(router)
        .provide(argsSymbol, createArgs(Args))
        .mount("#app");
})()