import {createRouter, createWebHashHistory} from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/message",
        name: "Message",
        component: () => import(/* webpackChunkName: "message" */ "../views/dialogs/Message.vue")
    }]
});