import {createRouter, createWebHashHistory} from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/",
        name: "Home",
        component: () => import("../views/pages/Home.vue")
    }, {
        path: "/about",
        name: "About",
        component: () => import("../views/pages/About.vue")
    }, {
        path: "/message",
        name: "Message",
        component: () => import("../views/dialogs/Message.vue")
    }]
});
