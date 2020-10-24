import {createRouter, createWebHashHistory} from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ "../views/pages/Home.vue")
    }, {
        path: "/about",
        name: "About",
        component: () => import(/* webpackChunkName: "about" */ "../views/pages/About.vue")
    }, {
        path: "/message",
        name: "Message",
        component: () => import(/* webpackChunkName: "message" */ "../views/pages/dialogs/Message.vue")
    }]
});
