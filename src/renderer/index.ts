import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import {ipcRenderer} from "electron";
import {argsData} from "@/renderer/store";
import {messageBack} from "./utils";

messageBack();
ipcRenderer.once("window-load", (event, args) => {
    argsData.window = args;
    createApp(App)
        .use(router)
        .mount("#app");
});
