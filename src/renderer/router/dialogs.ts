import {createRouter, createWebHashHistory} from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/Message',
        name: 'Message',
        component: () => import(/* webpackChunkName: "Message" */ '../views/dialogs/Message.vue')
    }]
});