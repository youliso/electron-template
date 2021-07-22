import { createRouter, createWebHashHistory } from 'vue-router';
import { argsData } from '@/renderer/store';
import { windowUpdate } from '@/renderer/utils/window';

import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';

const Router = createRouter({
  history: createWebHashHistory(),
  routes: [...pageRoute, ...dialogRoute]
});

Router.beforeEach((to, from) => {
  if (to.path !== argsData.window.route) {
    //更新窗口路由
    argsData.window.route = to.path;
    windowUpdate();
  }
});

export default Router;
