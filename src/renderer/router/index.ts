import { createRouter, createWebHashHistory } from 'vue-router';
import { argsData } from '@/renderer/store';
import { windowUpdate } from '@/renderer/utils/window';

const Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/pages/Home.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/pages/About.vue')
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('../views/dialogs/Message.vue')
    }
  ]
});

Router.beforeEach((to, from) => {
  if (to.path !== argsData.window.route) {
    //更新窗口路由
    argsData.window.route = to.path;
    windowUpdate();
  }
});

export default Router;
