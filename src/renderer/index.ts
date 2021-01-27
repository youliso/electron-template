import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import {argsData} from "./store";
import {windowLoad, messageBack} from "./utils";

messageBack();
windowLoad().then(args => {
    argsData.window = args;
    createApp(App)
        .use(router)
        .mount("#app");
})
