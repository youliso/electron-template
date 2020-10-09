import {createRouter, createWebHashHistory} from 'vue-router';

export const appRoutes = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/pages/Home.vue')
    }, {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/pages/About.vue')
    }]
});


export const dialogRoutes = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'Message',
        component: () => import(/* webpackChunkName: "Message" */ '../views/dialogs/Message.vue')
    }]
});
