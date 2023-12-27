import { createRouter, createWebHashHistory } from 'vue-router';
import { windowUpdateCustomize } from '@youliso/electronic/ipc/window';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/message',
      component: () => import('@/renderer/views/dialog/message.vue')
    },
    {
      path: '/home',
      component: () => import('@/renderer/views/pages/home.vue')
    }
  ]
});

router.beforeEach((to, from) => {
  if (to.path !== window.customize.route) {
    //更新窗口路由
    window.customize.route = to.path;
    windowUpdateCustomize(window.customize);
  }
});

export default router;
